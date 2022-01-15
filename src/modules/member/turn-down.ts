import dataSave from '../utils/data-save'
import dataOpen from '../utils/data-open'
import analyzePerson from '../utils/analyze-person'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'

export default (person: number, id: string, reason: string) => {
  try {
    const ana = analyzePerson(person)
    const temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/deduction.sdbdata`)
    if (existsSync(temppath)) {
      let data = dataOpen(temppath)
      data.details[id].status = 'failed'
      data.details[id].msgs.turndown = reason
      dataSave(temppath, data)
      return {
        status: 'ok',
      }
    } else {
      return {
        status: 'error',
        reason: 'not-exists',
      }
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: <string>e,
    }
  }
}
