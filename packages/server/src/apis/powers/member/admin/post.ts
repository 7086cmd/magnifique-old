import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import loginAdmin from 'packages/server/src/modules/admin/login-admin'
import { createMember } from 'packages/server/src/modules/powers/member'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>
export default async (ctx: Context) => {
  try {
    console.log(ctx.request.body)
    const { auth, data } = ctx.request.body as { auth: { password: string }; data: { member: member } }
    const { password } = auth
    const { member } = data
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = createMember(member)
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
