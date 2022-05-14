/** @format */

import { RouterContext } from "@koa/router";
import loginMember from "packages/server/src/modules/member/login-member";
import { createDeduction } from "packages/server/src/modules/powers/deduction";
import { memberDutyLimitCheckPower } from "packages/server/src/modules/powers/member";

export default async (ctx: RouterContext) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { number: number; password: string };
      data: { content: deduction };
    };
    const { number, password } = auth;
    const { content } = data;
    if (loginMember(Number(number), password).status == "ok") {
      if (memberDutyLimitCheckPower(String(number), "deduction")) {
        ctx.response.body = createDeduction(content);
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
      text: new Error(<string>e).message,
    };
  }
};
