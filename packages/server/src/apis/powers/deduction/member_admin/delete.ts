import { RouterContext } from '@koa/router'
import loginMember from 'packages/server/src/modules/member/login-member'
import { deleteDeduction } from 'packages/server/src/modules/powers/deduction'
import { memberAdminLimitCheckPower } from 'packages/server/src/modules/powers/member'

export default async (ctx: RouterContext) => {
  try {
    const { auth, data } = ctx.request.body as {
      auth: { number: number; password: string }
      data: { person: number; id: string }
    }
    const { number, password } = auth
    const { id, person } = data
    if (loginMember(Number(number), password).status == 'ok') {
      if (memberAdminLimitCheckPower(ctx.params.id, 'deduction')) {
        ctx.response.body = deleteDeduction(Number(person), id)
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
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
