/** @format */

// import based-on dependences
import koaCors from "@koa/cors";
import KoaRouter from "@koa/router";
import { app, Notification, Menu, Tray } from "electron";
import { readFileSync } from "fs";
import { createServer as createHttpServer } from "http";
import { encode as encodeGBK } from "iconv-lite";
// import server dependences
import Koa from "koa";
import koaBodyparser from "koa-bodyparser";
import koaStatic from "koa-static";
import { resolve } from "path";
import { Server } from "socket.io";
import { URLSearchParams } from "url";
import { v4 } from "uuid";
// import admin productions
import loginAdmin from "./modules/admin/login-admin";
import editPassword from "./modules/class/edit-password";
// import class productions
import loginClass from "./modules/class/login-class";
import allowPowers from "./modules/database/allow-powers";
import { readData, writeData } from "./modules/database/config";
// import data
import dbCreate from "./modules/database/db-create";
import getDepartmentData from "./modules/database/get-department-data";
import getPublicPower from "./modules/database/get-public-power";
import networks from "./modules/database/networks";
// import member productions
import loginMember from "./modules/member/login-member";
import newPassword from "./modules/member/new-password";
import * as deductionActions from "./modules/powers/deduction";
import * as memberActions from "./modules/powers/member";
// Refactor: import uses
import * as utils from "./modules/utils";
import { loginModule } from "./modules/im";
import * as API from "./apis";

let tray: Tray;
let csvTokens: Record<string, string> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type context = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;

// Initializate Server.
const server = new Koa();
const router = new KoaRouter();
let callBacks =
  process.env.NODE_ENV === "production"
    ? new Koa()
        .use(async (ctx) => {
          const url = ctx.URL;
          url.protocol = "https";
          ctx.redirect(url.toString());
        })
        .callback()
    : server.callback();
const httpServer = createHttpServer(callBacks);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["magnifique"],
    credentials: true,
  },
});
server.use(koaBodyparser());

// Generate a get-password way for `get-method`
const getPassword = (ctx: context) => {
  // I really don't want to let them in (Look, UP!)
  const params = new URLSearchParams(ctx.querystring);
  const password = params.get("password");
  if (password == null) {
    throw "No this item!";
  } else {
    return password;
  }
};

// Create Database(if not exists)
dbCreate();
writeData(networks());

// Serve Static File(Front End)
if (process.env.NODE_ENV === "production") {
  server.use(koaStatic(resolve(__dirname, "./pages")));
  router.get("/docs/:filename", async (ctx) => {
    ctx.response.body = readFileSync(
      resolve(__dirname, "./docs/", ctx.params.filename)
    ).toString();
  });
} else {
  // For safety, we don't allow to use `koaCors` in production.
  server.use(koaCors({}));
}
router.get("/api/admin/export/download/:token", async (ctx) => {
  if (csvTokens[ctx.params.token] === undefined) {
    ctx.response.type = "html";
    ctx.response.body = "<p>未找到</p>";
    return;
  } else {
    ctx.response.type = "csv";
    ctx.response.body = encodeGBK(csvTokens[ctx.params.token], "gbk");
    delete csvTokens[ctx.params.token];
  }
});
router.get("/api/admin/export/download/:token", async (ctx) => {
  if (csvTokens[ctx.params.token] === undefined) {
    ctx.response.type = "html";
    ctx.response.body = "<p>未找到</p>";
    return;
  } else {
    ctx.response.type = "csv";
    ctx.response.body = encodeGBK(csvTokens[ctx.params.token], "gbk");
    delete csvTokens[ctx.params.token];
  }
});
router.get("/api/auth/member/list", async (ctx) => {
  ctx.response.body = {
    status: "ok",
    details: memberActions.getMap({ type: "all", as: "class" }),
  };
});

// Class APIs
router.get("/api/class/:gradeid/:classid/login", async (ctx) => {
  const params = new URLSearchParams(ctx.querystring);
  const password = params.get("password");
  const { gradeid, classid } = ctx.params;
  ctx.response.type = "json";
  ctx.response.body = loginClass(
    parseInt(gradeid),
    parseInt(classid),
    String(password)
  );
});
router.get("/api/class/member", API.Powers.Member.Class.Get);
router.get("/api/class/deduction", async (ctx) => {
  const params = new URLSearchParams(ctx.querystring);
  const password = params.get("password") as string;
  const gradeid = params.get("gradeid") as string;
  const classid = params.get("classid") as string;
  if (
    loginClass(parseInt(gradeid), parseInt(classid), password).status == "ok"
  ) {
    ctx.response.body = deductionActions.getClass(
      parseInt(gradeid),
      parseInt(classid)
    );
  } else {
    ctx.response.body = {
      status: "error",
      reason: "password-error",
    };
  }
});

router.post("/api/class/member", API.Powers.Member.Class.Post);
router.post("/api/class/edit/password", async (ctx) => {
  try {
    const password = ctx.request.body.password;
    const { gradeid, classid, newp } = ctx.request.body;
    if (
      loginClass(parseInt(gradeid), parseInt(classid), String(password))
        .status == "ok"
    ) {
      ctx.response.body = editPassword(
        gradeid,
        classid,
        utils.createDEBase64(newp)
      );
    } else {
      ctx.response.body = {
        status: "error",
        reason: "password-wrong",
      };
    }
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});

// Member APIs
router.get("/api/member/getinfo/:person", async (ctx) => {
  try {
    const { person } = ctx.params;
    ctx.response.body = {
      status: "ok",
      details: memberActions.singleProcess(
        memberActions.getSingleMemberAsRaw(parseInt(person)).details as member
      ),
    };
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});
router.get("/api/member/getinfo/:id/raw", async (ctx) => {
  try {
    const { id } = ctx.params;
    ctx.response.body = memberActions.getSingleMemberAsRaw(parseInt(id));
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});
router.get("/api/member/:id/login", async (ctx) => {
  try {
    const password = getPassword(ctx);
    const { id } = ctx.params;
    ctx.response.body = loginMember(parseInt(id), password);
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});

// 青志部管理义工可用
router.get("/api/member/admin/member", API.Powers.Member.MemberAdmin.Get);
// Member Admin API (Member)
router.put("/api/member/admin/member", API.Powers.Member.MemberAdmin.Put);
router.delete("/api/member/admin/member", API.Powers.Member.MemberAdmin.Delete);
router.patch("/api/member/admin/member", API.Powers.Member.MemberAdmin.Patch);
router.post("/api/member/admin/member", API.Powers.Member.MemberAdmin.Post);

router.post("/api/member/:id/edit/password", async (ctx) => {
  try {
    const { password } = ctx.request.body;
    const { id } = ctx.params;
    if (loginMember(parseInt(id), password).status == "ok") {
      ctx.response.body = newPassword(
        parseInt(id),
        utils.createDEBase64(ctx.request.body.newp)
      );
    } else {
      ctx.response.body = {
        status: "error",
        reason: "password-wrong",
      };
    }
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});

// 纪检部可用API
router.get("/api/member/admin/deduction", API.Powers.Deduction.MemberAdmin.Get);
router.delete(
  "/api/member/admin/deduction",
  API.Powers.Deduction.MemberAdmin.Delete
);

router.get("/api/member/deduction", API.Powers.Deduction.Member.Get);
router.post("/api/member/deduction", API.Powers.Deduction.Member.Post);
router.delete("/api/member/deduction", API.Powers.Deduction.Member.Delete);

router.post("/api/member/admin/export/deduction/class", async (ctx) => {
  try {
    const { password, start, end, number } = ctx.request.body as {
      password: string;
      start: string;
      end: string;
      number: number;
    };
    if (loginMember(number, password).status == "ok") {
      const data = deductionActions.exportAsClass({
        start,
        end,
      });
      const token = v4();
      csvTokens[token] = data.details;
      ctx.response.body = {
        status: "ok",
        details: {
          token,
        },
      };
    } else {
      ctx.response.body = {
        status: "error",
        reason: "password-wrong",
      };
    }
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});
router.post("/api/member/admin/export/deduction/detail", async (ctx) => {
  try {
    const { password, start, end, number } = ctx.request.body as {
      password: string;
      start: string;
      end: string;
      number: number;
    };
    if (loginMember(number, password).status == "ok") {
      const data = deductionActions.exportAsDetails({
        start,
        end,
      });
      const token = v4();
      csvTokens[token] = data.details as string;
      ctx.response.body = {
        status: "ok",
        details: {
          token,
        },
      };
    } else {
      ctx.response.body = {
        status: "error",
        reason: "password-wrong",
      };
    }
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});

// Admin APIs (For School Leaders.)
router.get("/api/admin/login", async (ctx) => {
  try {
    const password = getPassword(ctx);
    ctx.response.body = loginAdmin(password);
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});
router.get("/api/admin/deduction", API.Powers.Deduction.Admin.Get);
router.get("/api/admin/member", API.Powers.Member.Admin.Get);

router.delete("/api/admin/deduction", API.Powers.Deduction.Admin.Delete);
router.put("/api/admin/member", API.Powers.Member.Admin.Put);
router.patch("/api/admin/member", API.Powers.Member.Admin.Patch);
router.post("/api/admin/member", API.Powers.Member.Admin.Post);
router.delete("/api/admin/member", API.Powers.Member.Admin.Delete);

// All APIs
router.post("/api/feed/back", async (ctx) => {
  // Here, it is no use to check the password
  try {
    ctx.response.body = utils.createFeedback(ctx.request.body);
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
});
router.get("/api/department/", async (ctx) => {
  ctx.response.body = getDepartmentData() as status;
});
router.get("/api/department/list", async (ctx) => {
  const data = getDepartmentData();
  ctx.response.body = {
    status: "ok",
    details: utils.createObjectToArrayTransformer(
      "value",
      data.details.departments
    ),
  };
});
router.get("/api/department/:department/duty", async (ctx) => {
  ctx.response.body = {
    status: "ok",
    details: allowPowers(ctx.params.department),
  };
});
router.get("/api/power/list", async (ctx) => {
  ctx.response.body = {
    status: "ok",
    details: utils.createObjectToArrayTransformer(
      "value",
      getPublicPower().details.power
    ),
  };
});
router.get("/api/power", async (ctx) => {
  ctx.response.body = getPublicPower();
});
router.get("/config", async (ctx) => {
  ctx.response.body = readData();
});

router.get("/update", (ctx) => {
  ctx.response.body = API.ChangeLog.latest();
});

// Use routes to register APIs.
server.use(router.routes());
server.use(router.allowedMethods());

// Redirect 404 pages(route)
server.use(async (ctx) => {
  if (ctx.status == 404) {
    if (process.env.NODE_ENV == "production") {
      ctx.response.body = readFileSync(
        resolve(__dirname, "./pages/index.html")
      ).toString();
    } else {
      ctx.response.type = "html";
      ctx.response.body =
        "Sorry, we do not have index page in <b>Development</b> server.";
    }
  }
});

// Socket.io Chat Product
// eslint-disable-next-line @typescript-eslint/no-unused-vars
io.on("connection", (socket) => {
  // ...
  let query = socket.handshake.query.username as string;
  if (
    (loginModule(
      socket.handshake.query.username as string,
      socket.handshake.query.password as string
    ).status as string) == "ok"
  )
    socket.join(query);
});

app.setLoginItemSettings({
  openAtLogin: process.env.NODE_ENV == "production",
});

app.whenReady().then(() => {
  tray = new Tray(
    process.env.NODE_ENV === "development"
      ? resolve(__dirname, "../../../icons/server.ico")
      : resolve(__dirname, "../icons/server.ico")
  );
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "退出",
        click: () => {
          app.quit();
        },
      },
    ])
  );

  new Notification({
    title: "Magnifique 平台已经在运行！",
    body: "可以通过本机 IP 地址访问！",
  });
});

// Listen the Server(Let it run.)
httpServer.listen(80);

// try {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require('electron-reloader')(module)
//   // eslint-disable-next-line no-empty
// } catch (_e) {}
