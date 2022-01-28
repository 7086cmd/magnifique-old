import { tmpdir } from 'os'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import analyzePerson from '../utils/analyze-person'
import { parse, stringify } from 'json5'
import { v4 } from 'uuid'
import decoder from '../utils/decode-base64'
import encoder from '../utils/encode-base64'

export default (configuration: deduction) => {
  let uuid = v4()
  const ana = analyzePerson(configuration.person)
  const temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/deduction.sdbdata`)
  if (existsSync(temppath)) {
    try {
      const doc = readFileSync(temppath).toString()
      const decoded = parse(decoder(doc))
      while (decoded[uuid] !== undefined) {
        uuid = v4()
      }
      decoded.details[uuid] = configuration
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
