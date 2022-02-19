import editStatus from './edit-status'
import getOwn from '../read/get-own'

export default (Data: number[], createId: string, status: volunteer['status']) => {
  Data.forEach((item) => {
    const volunteerInAMember = getOwn(item).details
    volunteerInAMember.filter((volunteerItem) => volunteerItem.createId === createId)
    volunteerInAMember.forEach((volunteerItem) => {
      editStatus(item, volunteerItem.idInUserData, status)
    })
  })
  return {
    status: 'ok',
  }
}
