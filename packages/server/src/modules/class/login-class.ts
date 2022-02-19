import { existsSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import { createYearTransformer, createSdbdataParser, createDEBase64 } from '../utils'

export default (gradeid: number, classid: number, password: string) => {
  try {
    let dirpth = resolve(tmpdir(), '..', 'magnifique', String([1, 2, 3].includes(gradeid) ? createYearTransformer(gradeid) : gradeid), String(classid), 'password.sdbdata')
    if (existsSync(dirpth)) {
      const pwdcor: string = createSdbdataParser(dirpth).password
      const pwdnow = sha512(createDEBase64(password))
      if (pwdcor == pwdnow) {
        return {
          status: 'ok',
        } as status
      } else {
        return {
          status: 'error',
          reason: 'password-wrong',
        } as status
      }
    } else {
      return {
        status: 'error',
        reason: 'not-exist',
      } as status
    }
  } catch (e: unknown) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    } as status
  }
}
