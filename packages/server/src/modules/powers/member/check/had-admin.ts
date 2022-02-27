import getSingleMemberAsRaw from '../crud/read/raw'
export default (memberNumber: string | number, dutyWhichIsWaitingForCheck: 'post' | 'deduction' | 'volunteer' | 'radio' | 'member' | 'member-volunteer') => {
  if (getSingleMemberAsRaw(Number(memberNumber)).status === 'error') {
    throw '不存在的文件'
  } else {
    if (dutyWhichIsWaitingForCheck === 'member') {
      return (getSingleMemberAsRaw(Number(memberNumber)).details as unknown as member).union.position === 'minister'
    } else if (dutyWhichIsWaitingForCheck === 'member-volunteer') {
      return (getSingleMemberAsRaw(Number(memberNumber)).details as unknown as member).union.position.includes('minister')
    } else {
      return (getSingleMemberAsRaw(Number(memberNumber)).details as unknown as member).union.admin.includes(dutyWhichIsWaitingForCheck)
    }
  }
}
