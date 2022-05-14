/** @format */

import type Koa from "koa";
import type KoaRouter from "@koa/router";
import {
  getMap,
  getSingleMemberAsRaw,
} from "packages/server/src/modules/powers/member";

type Context = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;

export default async (ctx: Context) => {
  try {
    const params = new URLSearchParams(ctx.querystring);
    const number = params.get("number") as string;
    const un = getSingleMemberAsRaw(Number(number)).details?.union;
    if (un?.position.includes("chairman"))
      ctx.response.body = {
        status: "ok",
        details: getMap({ type: "all", withPosition: true, as: "department" }),
      };
    else if (un?.position.includes("minister"))
      ctx.response.body = {
        status: "ok",
        details: [
          getMap({
            type: "department",
            withPosition: true,
            department: un.department,
          }),
        ],
      };
    else
      ctx.response.body = {
        status: "error",
        reason: "no-auth",
      };
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(e as string).message,
    };
  }
};
