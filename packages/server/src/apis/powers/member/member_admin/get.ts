import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import { getMap } from 'packages/server/src/modules/powers/member'

type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>

export default async (ctx: Context) => {
  try {
    ctx.response.body = {
      status: 'ok',
      details: getMap({ type: 'all', withPosition: true, as: 'department' }),
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
