import dataOpen from '../utils/data-open'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'
import objectToArray from '../utils/object-to-array'
import analyzePerson from '../utils/analyze-person'

export default (numb: number) => {
  const ana = analyzePerson(numb)
  let temppath = resolve(tmpdir(), `..`, `magnifique`, `${ana.gradeid}`, `${ana.classid}`, `members`, `${numb}.sdbdata`)
  if (existsSync(temppath)) {
    try {
      const opwd = dataOpen(temppath).workflow.details
      return {
        status: 'ok',
        details: objectToArray('id', opwd),
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
