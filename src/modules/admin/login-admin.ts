import { existsSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import { createSdbdataParser, createENBase64 } from '../utils'

export default (password: string) => {
  try {
    // eslint-disable-next-line prefer-const
    let dirpth = resolve(tmpdir(), `../magnifique/admin/password.sdbdata`)
    if (existsSync(dirpth)) {
      const pwdcor = createSdbdataParser(dirpth).secret.password
      const pwdnow = sha512(createENBase64(password))
      if (pwdcor == pwdnow) {
        return {
          status: 'ok',
        }
      } else {
        return {
          status: 'error',
          reason: 'password-wrong',
        }
      }
    } else {
      return {
        status: 'error',
        reason: 'not-exist',
      }
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
