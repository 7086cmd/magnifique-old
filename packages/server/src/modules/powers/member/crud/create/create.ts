import { tmpdir } from 'os'
import { existsSync } from 'fs'
import { resolve } from 'path'
import analyzePerson from '../../../../utils/analyze-person'
import { createMemberIndex, createSdbdataSaver, createENBase64 } from '../../../../utils'
import { sha512 } from 'js-sha512'

export default (configuration: member) => {
  const ana = analyzePerson(configuration.number)
  let temppath = resolve(tmpdir(), '..', 'magnifique', String(ana.gradeid), String(ana.classid), 'members')
  if (existsSync(temppath)) {
    try {
      temppath = createMemberIndex(configuration.number)
      configuration.password = sha512(createENBase64(String(configuration.number)))
      createSdbdataSaver(temppath, configuration)
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
