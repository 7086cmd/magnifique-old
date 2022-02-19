import getMemberAsRaw from '../../crud/read/raw'
import { createMemberIndex, createSdbdataSaver } from '../../../../utils'

export default (number: number, violation: -1 | 1) => {
  const memberInfo = getMemberAsRaw(number).details as member
  memberInfo.record.violation += violation
  createSdbdataSaver(createMemberIndex(number), memberInfo)
}
