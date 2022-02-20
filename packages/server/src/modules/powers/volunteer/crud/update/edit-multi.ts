import editStatus from './edit-status'
import getOwn from '../read/get-own'
import { pullAll, flattenDeep, uniq } from 'lodash'
import getAll from '../read/get-all'

export default (Data: number[], createId: string) => {
  const allRecorded = uniq(
    flattenDeep(
      getAll()
        .details.filter((x) => x.createId === createId)
        .map((x) => x.person)
    )
  )
  const allRecordedSuccess = uniq(
    flattenDeep(
      flattenDeep(
        getAll()
          .details.filter((x) => x.createId === createId)
          .map((x) => x.records)
      )
        .filter((x) => x.status === 'done')
        .map((x) => x.person)
    )
  )
  const memberNotChecked = pullAll(allRecorded, [...Data, ...allRecordedSuccess])
  Data.forEach((item) => {
    const volunteerInAMember = getOwn(item).details
    volunteerInAMember.filter((volunteerItem) => volunteerItem.createId === createId)
    volunteerInAMember.forEach((volunteerItem) => {
      editStatus(item, volunteerItem.idInUserData, 'done')
    })
  })
  memberNotChecked.forEach((item) => {
    const volunteerInAMember = getOwn(item).details
    volunteerInAMember.filter((volunteerItem) => volunteerItem.createId === createId)
    volunteerInAMember.forEach((volunteerItem) => {
      editStatus(item, volunteerItem.idInUserData, 'miss')
    })
  })
  return {
    status: 'ok',
  }
}
