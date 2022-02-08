import getRawMember from '../../get-raw-member'
import dataSave from '../../../utils/data-save'
import generateMemberIndex from '../../../utils/generate-member-index'

export default (number: number, violation: -1 | 1) => {
  const memberInfo = getRawMember(number).details as member
  memberInfo.record.violation += violation
  dataSave(generateMemberIndex(number), memberInfo)
}
