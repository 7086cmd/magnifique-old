/** @format */

import { RouterContext } from "@koa/router";
import loginAdmin from "packages/server/src/modules/admin/login-admin";
import { deleteDeduction } from "packages/server/src/modules/powers/deduction";

export default async (ctx: RouterContext) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { password: string };
      data: { person: number; id: string };
    };
    const { password } = auth;
    const { id, person } = data;
    if (loginAdmin(password).status == "ok") {
      ctx.response.body = deleteDeduction(person, id);
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
};
