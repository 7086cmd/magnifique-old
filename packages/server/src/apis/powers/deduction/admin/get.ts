/** @format */

import { RouterContext } from "@koa/router";
import { getAll } from "packages/server/src/modules/powers/deduction";

export default async (ctx: RouterContext) => {
  try {
    ctx.response.body = getAll();
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
};
