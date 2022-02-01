import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import analyzePerson from '../utils/analyze-person'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

export default (numb: number, workfl: workflow) => {
  const ana = analyzePerson(numb)
  let temppath = resolve(tmpdir(), `..`, `magnifique`, `${ana.gradeid}`, `${ana.classid}`, `members`, `${numb}.sdbdata`)
  if (existsSync(temppath)) {
    try {
      let cfg = dataOpen(temppath) as member
      let id = v4()
      while (cfg.workflow.details[id] !== undefined) {
        id = v4()
      }
      workfl['status'] = 'planning'
      workfl['start'] = dayjs().toJSON()
      cfg.workflow.details[id] = workfl
      dataSave(temppath, cfg)
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
