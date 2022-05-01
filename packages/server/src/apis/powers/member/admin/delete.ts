import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import loginAdmin from 'packages/server/src/modules/admin/login-admin'
import { deleteMember } from 'packages/server/src/modules/powers/member'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>
export default async (ctx: Context) => {
  try {
    const { auth, data } = ctx.request.body as { auth: { password: string }; data: { person: number } }
    const { password } = auth
    const { person } = data
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = deleteMember(Number(person))
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
