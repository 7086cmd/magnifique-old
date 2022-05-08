import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import { editPosition } from 'packages/server/src/modules/powers/member'
import loginAdmin from 'packages/server/src/modules/admin/login-admin'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>

export default async (ctx: Context) => {
  // Edit Info
  try {
    const { auth, data } = ctx.request.body as { auth: { password: string }; data: { patch: string; person: number } }
    const { password } = auth
    const { person, patch } = data
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = editPosition(Number(person), patch)
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
      text: new Error(e as string).message,
    }
  }
}
