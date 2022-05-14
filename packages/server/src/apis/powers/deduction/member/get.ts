/** @format */

import { RouterContext } from "@koa/router";
import { getOwn } from "packages/server/src/modules/powers/deduction";

export default async (ctx: RouterContext) => {
  {
    try {
      const params = new URLSearchParams(ctx.querystring);
      const number = Number(params.get("number") as string);
      ctx.response.body = getOwn(Number(number));
    } catch (e) {
      ctx.response.body = {
        status: "error",
        reason: "type-error",
        text: new Error(<string>e).message,
      };
    }
  }
};
