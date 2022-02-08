import getRawMember from '../../get-raw-member'
import dataSave from '../../../utils/data-save'
import generateMemberIndex from '../../../utils/generate-member-index'

export default (number: number, action: number) => {
  const memberInfo = getRawMember(number).details as member
  memberInfo.record.actions += action
  dataSave(generateMemberIndex(number), memberInfo)
}
