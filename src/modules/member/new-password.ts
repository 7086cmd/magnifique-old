import { tmpdir } from 'os'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import encodeBase64 from '../utils/encode-base64'
import analyzePerson from '../utils/analyze-person'
import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'

export default (person: number, newPwd: string) => {
    const ana = analyzePerson(person)
    let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/${person}.sdbdata`)
    if (existsSync(temppath)) {
        // try {
        let old = dataOpen(temppath)
        old['password'] = sha512(encodeBase64(newPwd))
        dataSave(temppath, old)
        return {
            status: 'ok',
        }
        // } catch (e) {
        //     return {
        //         status: 'error',
        //         reason: 'type-error',
        //         text: <string>e,
        //     }
        // }
    } else {
        return {
            status: 'error',
            reason: 'not-exists',
        }
    }
}
