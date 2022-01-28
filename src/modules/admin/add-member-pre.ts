import { tmpdir } from 'os'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { stringify } from 'json5'
import encoder from '../utils/encode-base64'
import analyzePerson from '../utils/analyze-person'
import { sha512 } from 'js-sha512'
export default (configuration: member) => {
  const ana = analyzePerson(configuration.number)
  let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/pre/`)
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${configuration.number}.sdbdata`)
      configuration['password'] = sha512(encoder(String(configuration.number)))
      writeFileSync(temppath, encoder(stringify(configuration)))
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
