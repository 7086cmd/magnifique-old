import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import { getMap } from 'packages/server/src/modules/powers/member'
import loginClass from 'packages/server/src/modules/class/login-class'

type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>
export default async (ctx: Context) => {
  try {
    const params = new URLSearchParams(ctx.querystring)
    const gradeid = params.get('gradeid') as string
    const classid = params.get('classid') as string
    const password = params.get('password') as string
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      ctx.response.body = getMap({ type: 'class', gradeid: Number(gradeid), classid: Number(classid) })
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
