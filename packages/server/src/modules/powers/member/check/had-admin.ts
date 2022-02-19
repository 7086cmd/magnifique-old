import getSingleMemberAsRaw from '../crud/read/raw'
export default (memberNumber: string | number, dutyWhichIsWaitingForCheck: 'post' | 'deduction' | 'volunteer' | 'radio' | 'member') => {
  if (getSingleMemberAsRaw(Number(memberNumber)).status === 'error') {
    throw '不存在的文件'
  } else {
    return (getSingleMemberAsRaw(Number(memberNumber)).details as unknown as member).union.admin.includes(dutyWhichIsWaitingForCheck)
  }
}
