/* eslint-disable prefer-const */
import { tmpdir } from 'os'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import decodeBase64 from '../utils/decode-base64'
import transformDate from '../utils/transform-date'
import { parse as parseToJSON5, stringify as stringifyToJSON5 } from 'json5'

export default (contentType: string, gradeid: number, classid: number) => {
    if (gradeid === 1 || gradeid === 2 || gradeid === 3) {
        gradeid = transformDate(gradeid)
    }
    const dirpth = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/${contentType}.sdbdata`)
    let content = parseToJSON5(decodeBase64(readFileSync(dirpth).toString()))
    content['status'] = 'ok'
    return stringifyToJSON5(content)
}
