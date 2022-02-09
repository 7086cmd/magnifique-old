import { createMemberIndex, createSdbdataParser, createSdbdataSaver, createTypeError } from '../../../utils'
import { existsSync } from 'fs'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

export default (numb: number, workfl: workflow) => {
  let temppath = createMemberIndex(numb)
  if (existsSync(temppath)) {
    try {
      let cfg = createSdbdataParser(temppath) as member
      let id = v4()
      while (cfg.workflow.details[id] !== undefined) {
        id = v4()
      }
      workfl['status'] = 'planning'
      workfl['start'] = dayjs().toJSON()
      cfg.workflow.details[id] = workfl
      createSdbdataSaver(temppath, cfg)
      return {
        status: 'ok',
      }
    } catch (e) {
      return createTypeError(e)
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    }
  }
}
