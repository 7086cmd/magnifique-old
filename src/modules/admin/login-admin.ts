import { existsSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import * as JSON5 from 'json5'
const loginClass = (password: string) => {
    try {
        // eslint-disable-next-line prefer-const
        let dirpth = resolve(tmpdir(), `../magnifique/admin/password.sdbdata`)
        if (existsSync(dirpth)) {
            const pwdcor = JSON5.parse(Buffer.from(readFileSync(dirpth).toString(), 'base64').toString())['secret']['password']
            const pwdnow = sha512(Buffer.from(password, 'base64').toString())
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
export default loginClass
