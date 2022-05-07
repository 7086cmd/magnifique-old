import loginClass from 'packages/server/src/modules/class/login-class'
import { createMember } from 'packages/server/src/modules/powers/member'
import type Koa from 'koa'
import type KoaRouter from '@koa/router'

type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>>

/**
 * @param {Context} ctx the context of the api.
 */
export default async (ctx: Context) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { gradeid: number; classid: number; password: string }
      data: { member: member }
    }
    const { gradeid, classid, password } = auth
    if (loginClass(Number(gradeid), Number(classid), password).status == 'ok') {
      ctx.response.body = createMember(data.member)
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
