/** @format */

/** @format */

/**
 * @path /api/admin/departments
 * @method POST
 * @description Create a new department
 * @auth true
 * @authType admin
 */

import type Koa from "koa";
import type KoaRouter from "@koa/router";
import { CRUD } from "../../../../modules/powers/departments";
import loginAdmin from "packages/server/src/modules/admin/login-admin";

type Ctx = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;
export default async (ctx: Ctx) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { password: string };
      data: { department: departmentItem; id: string };
    };
    const { password } = auth;
    const { department, id } = data;
    if (loginAdmin(password).status == "ok") {
      ctx.response.body = CRUD.put({
        ...department,
        id,
      });
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
      text: new Error(e as string).message,
    };
  }
};
