/** @format */

import type Koa from "koa";
import type KoaRouter from "@koa/router";
import {
  createMember,
  memberAdminLimitCheckPower,
} from "packages/server/src/modules/powers/member";
import loginMember from "packages/server/src/modules/member/login-member";

type Context = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;

export default async (ctx: Context) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { password: string; number: number };
      data: { member: member };
    };
    if (loginMember(Number(auth.number), auth.password).status == "ok") {
      if (memberAdminLimitCheckPower(auth.number, "member-register")) {
        ctx.response.body = createMember(data.member);
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
