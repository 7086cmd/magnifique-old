import { tmpdir } from 'os'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import transformDate from '../utils/transform-date'
import { parse, stringify } from 'json5'
import decoder from '../utils/decode-base64'
import encoder from '../utils/encode-base64'

export default (gradeid: number, classid: number, newPassword: string) => {
    if (gradeid in [1, 2, 3]) {
        gradeid = transformDate(gradeid)
    }
    const temppath = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/password.sdbdata`)
    if (existsSync(temppath)) {
        try {
            const doc = readFileSync(temppath).toString()
            const decoded = parse(decoder(doc))
            decoded.password = sha512(newPassword)
            const docc = stringify(decoded)
            writeFileSync(temppath, encoder(docc))
            return {
                status: 'ok',
            }
        } catch (e) {
            return {
                status: 'error',
                reason: 'type-error',
                text: new Error(<string>e).message,
            }
        }
    } else {
        return {
            status: 'error',
            reason: 'not-exists',
        }
    }
}
