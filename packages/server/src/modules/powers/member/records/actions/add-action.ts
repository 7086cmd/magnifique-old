import getMemberAsRaw from '../../crud/read/raw'
import { createMemberIndex, createSdbdataSaver } from '../../../../utils'

export default (number: number, actions: -1 | 1) => {
  const memberInfo = getMemberAsRaw(number).details as member
  memberInfo.record.actions += actions
  createSdbdataSaver(createMemberIndex(number), memberInfo)
}
