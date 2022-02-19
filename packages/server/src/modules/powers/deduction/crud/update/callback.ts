import { createSdbdataParser, createSdbdataSaver, createYearTransformer } from '../../../../utils'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { existsSync } from 'fs'

export default (configuration: { classid: number; gradeid: number; id: string; msg: string }) => {
  try {
    if (configuration.gradeid in [1, 2, 3]) {
      configuration.gradeid = createYearTransformer(configuration.gradeid)
    }
    const temppath = resolve(tmpdir(), `../magnifique/${configuration.gradeid}/${configuration.classid}/deduction.sdbdata`)
    if (existsSync(temppath)) {
      let data = createSdbdataParser(temppath) as {
        details: Record<string, deduction>
      }
      data.details[configuration.id].msgs.feedback = configuration.msg
      data.details[configuration.id].status = 'processing'
      createSdbdataSaver(temppath, data)
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
      text: new Error(<string>e).message,
    }
  }
}
