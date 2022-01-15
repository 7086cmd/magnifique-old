import { tmpdir } from 'os'
import { readFileSync, existsSync } from 'fs'
import decodeBase64 from '../utils/decode-base64'
import { parse } from 'json5'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import analyzePerson from '../utils/analyze-person'

export default (person: number, password: string) => {
  const ana = analyzePerson(person)
  let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/`)
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${person}.sdbdata`)
      const opwd = parse(decodeBase64(readFileSync(temppath).toString())).password
      const npwd = sha512(password)
      if (opwd == npwd) {
        return {
          status: 'ok',
        }
      } else {
        return {
          status: 'error',
          reason: 'password-wrong',
        }
      }
    } catch (e) {
      return {
        status: 'error',
        reason: 'type-error',
        text: <string>e,
      }
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
