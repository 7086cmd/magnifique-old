// formula: (素质分 / 10) 四舍五入后除以2
import calculate from './calculate'
import { createMemberIndex, createSdbdataParser, createSdbdataSaver } from '../../../utils'
import { v4 as createUUID } from 'uuid'
import dayjs from 'dayjs'
import { existsSync } from 'fs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
export default (memberNumber: number) => {
  const score = calculate(memberNumber).details.score
  if (existsSync(createMemberIndex(memberNumber))) {
    const detail = createSdbdataParser(createMemberIndex(memberNumber)) as member
    let uuid = createUUID()
    while (detail.volunteer.details[uuid] !== undefined) {
      uuid = createUUID()
    }

    let showAddForVolunteer = true
    for (const val of Object.values(detail.volunteer.details)) {
      if (Math.abs(dayjs.duration(dayjs(new Date(val.time)).diff(dayjs())).asMonths()) < 6 && val.project === '期末义工结算') {
        showAddForVolunteer = false
      }
    }
    if (showAddForVolunteer) {
      detail.volunteer.details[uuid] = {
        person: memberNumber,
        duration: Math.round(score / 10) / 2,
        project: '期末义工结算',
        place: '学生会/团总支',
        status: 'done',
        time: new Date(dayjs().toJSON()),
      }
    }
    createSdbdataSaver(createMemberIndex(memberNumber), detail)
  }
}
