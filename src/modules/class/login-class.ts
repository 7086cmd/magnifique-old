import { existsSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import transformDate from '../utils/transform-date'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import * as JSON5 from 'json5'
const loginClass = (gradeid: number, classid: number, password: string) => {
    try {
        let dirpth
        if (gradeid >= 1 && gradeid <= 3) {
            dirpth = resolve(tmpdir(), `../magnifique/${transformDate(gradeid)}/${classid}/password.sdbdata`)
        } else {
            dirpth = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/password.sdbdata`)
        }
        if (existsSync(dirpth)) {
            const pwdcor = JSON5.parse(Buffer.from(readFileSync(dirpth).toString(), 'base64').toString())['password']
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
    } catch (e: unknown) {
        return {
            status: 'error',
            reason: 'type-error',
            text: new Error(<string>e).message,
        }
    }
}
export default loginClass
