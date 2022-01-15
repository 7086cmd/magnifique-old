import { tmpdir } from 'os'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { parse, stringify } from 'json5'
import decoder from '../utils/decode-base64'
import encoder from '../utils/encode-base64'
import analyzePerson from '../utils/analyze-person'

export default (person: number, id: string) => {
    const { gradeid, classid } = analyzePerson(person)
    const temppath = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/deduction.sdbdata`)
    if (existsSync(temppath)) {
        try {
            const doc = readFileSync(temppath).toString()
            const decoded = parse(decoder(doc))
            delete decoded.details[id]
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
