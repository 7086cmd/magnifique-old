import { rmSync } from 'fs'
import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import { resolve } from 'path'
import analyzePerson from '../utils/analyze-person'
import { tmpdir } from 'os'

export default (number: number, id: string) => {
  try {
    const perss = analyzePerson(number)
    const temppath = resolve(tmpdir(), '..', 'magnifique', String(perss.gradeid), String(perss.classid), 'post.sdbdata')
    const data = dataOpen(temppath) as {
      details: Record<string, post>
    }
    const path = data.details[id].path
    rmSync(resolve(path))
    delete data.details[id]
    dataSave(temppath, data)
    return {
      status: 'ok',
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(e).message,
    }
  }
}
