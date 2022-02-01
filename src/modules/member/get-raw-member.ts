import dataOpen from '../utils/data-open'
import analyzePerson from '../utils/analyze-person'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'

export default (num: number) => {
  const ana = analyzePerson(num)
  const tempdir = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/${num}.sdbdata`)
  if (existsSync(tempdir)) {
    const ctn = dataOpen(tempdir)
    return {
      status: 'ok',
      details: ctn as member,
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
