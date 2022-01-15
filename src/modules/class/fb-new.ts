import dataSave from '../utils/data-save'
import dataOpen from '../utils/data-open'
import transformDate from '../utils/transform-date'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'

export default (configuration: { classid: number; gradeid: number; id: string; password?: string; msg: string }) => {
  try {
    if (configuration.gradeid in [1, 2, 3]) {
      configuration.gradeid = transformDate(configuration.gradeid)
    }
    const temppath = resolve(tmpdir(), `../magnifique/${configuration.gradeid}/${configuration.classid}/deduction.sdbdata`)
    if (existsSync(temppath)) {
      let data = dataOpen(temppath)
      data.details[configuration.id].msgs.feedback = configuration.msg
      data.details[configuration.id].status = 'processing'
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
