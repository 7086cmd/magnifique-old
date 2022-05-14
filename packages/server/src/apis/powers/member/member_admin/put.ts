/** @format */

import type Koa from "koa";
import type KoaRouter from "@koa/router";
import {
  editPosition,
  memberAdminLimitCheckPower,
} from "packages/server/src/modules/powers/member";
import loginMember from "packages/server/src/modules/member/login-member";
type Context = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;

export default async (ctx: Context) => {
  // Edit Info
  try {
    const { auth, data } = ctx.request.body as {
      auth: { password: string; number: number };
      data: { patch: string; person: number };
    };
    const { password, number } = auth;
    const { person, patch } = data;
    if (loginMember(Number(number), password).status == "ok") {
      if (memberAdminLimitCheckPower(number, "member")) {
        ctx.response.body = editPosition(Number(person), patch);
      } else {
        ctx.response.body = {
          status: "error",
          reason: "no-auth",
        };
      }
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
