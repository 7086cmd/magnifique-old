/** @format */

/**
 * @path /api/admin/departments
 * @method GET
 * @description Get all departments
 * @auth true
 * @authType admin
 */
import type Koa from "koa";
import type KoaRouter from "@koa/router";
import { CRUD } from "../../../../modules/powers/departments";

type Ctx = Koa.ParameterizedContext<
  Koa.DefaultState,
  Koa.DefaultContext &
    KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>
>;

export default async function (ctx: Ctx) {
  try {
    ctx.response.body = {
      status: "ok",
      details: CRUD.get(),
    };
  } catch (e) {
    ctx.response.body = {
      status: "error",
      reason: "type-error",
      text: new Error(e as string).message,
    };
  }
}
