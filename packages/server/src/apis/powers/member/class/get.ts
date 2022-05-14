/** @format */

import type Koa from "koa";
import type KoaRouter from "@koa/router";
import { getMap } from "packages/server/src/modules/powers/member";

type Context = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;
export default async (ctx: Context) => {
  try {
    const params = new URLSearchParams(ctx.querystring);
    const gradeid = params.get("gradeid") as string;
    const classid = params.get("classid") as string;
    ctx.response.body = {
      status: "ok",
      details: getMap({
        type: "class",
        gradeid: Number(gradeid),
        classid: Number(classid),
      }),
    };
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
};
