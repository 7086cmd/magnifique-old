import type Koa from 'koa'
import type KoaRouter from '@koa/router'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>
import { getMap } from 'packages/server/src/modules/powers/member'

export default async (ctx: Context) => {
  try {
    ctx.response.body = {
      status: 'ok',
      details: getMap({ type: 'all', as: 'department', withPosition: true }),
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(e as string).message,
    }
  }
}
