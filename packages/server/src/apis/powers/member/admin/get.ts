import type Koa from 'koa'
import type KoaRouter from '@koa/router'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>
import loginAdmin from 'packages/server/src/modules/admin/login-admin'
import { getMap } from 'packages/server/src/modules/powers/member'

export default async (ctx: Context) => {
  try {
    const params = new URLSearchParams(ctx.querystring)
    const password = params.get('password') as string
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = {
        status: 'ok',
        details: getMap({ type: 'all', as: 'department', withPosition: true }),
      }
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
