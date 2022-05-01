import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import { editPosition } from 'packages/server/src/modules/powers/member'
import loginAdmin from 'packages/server/src/modules/admin/login-admin'
type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>

export default async (ctx: Context) => {
  // Edit Info
  try {
    const { auth, data } = ctx.request.body as { auth: { password: string }; data: { position: member['union']['position']; member: number } }
    const { password } = auth
    const { member, position } = data
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = editPosition(Number(member), position as 'clerk' | 'vice-minister')
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
