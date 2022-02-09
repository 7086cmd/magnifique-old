// formula: 80 + 投稿数 * 5 + 检查到他人的违纪次数 + 反馈数 * 2 + 义工时间 * 3 - 点名违纪次数 * 15 - 扣分数 * 20
import deleteMember from '../crud/delete/delete'
import { createSdbdataSaver, createMemberIndex } from '../../../utils'
import { getOwn as getMyOwnDeduction } from '../../deduction'
import getMemberAsRaw from '../crud/read/raw'

const countWorkflow = (wfl: Record<string, workflow>) => {
  let t = 0
  for (let val of Object.values(wfl)) {
    const statuses = {
      planning: 0,
      working: 1,
      success: 3,
      depracted: -5,
    }
    t += statuses[val.status]
  }
  return t
}

const countVolunteer = (vol: Record<string, volunteer>) => {
  let t = 0
  for (let val of Object.values(vol)) {
    t = (t * 10 + val.duration * 10) / 10
  }
  return t
}

const countDeduction = (dec: Record<string, deduction>) => {
  let t = 0
  for (let val of Object.values(dec)) {
    t = (t * 100 + val.deduction * 100) / 100
  }
  return t
}

const countPost = (pos: Record<string, post>) => {
  return Object.entries(pos).length
}

export default (memberNum: number) => {
  let base = 80
  let infor = getMemberAsRaw(memberNum).details as member
  const score =
    base +
    countPost(infor.post?.details) * 5 +
    getMyOwnDeduction(memberNum).details.length +
    infor.record.actions * 2 +
    countVolunteer(infor.volunteer.details) -
    infor.record.violation * 20 -
    countDeduction(infor.deduction?.details) * 15 +
    countWorkflow(infor.workflow.details)
  if (score >= 100) {
    infor.record.score = 100
  } else {
    infor.record.score = score
  }
  // eslint-disable-next-line no-console
  console.log(`Member ${memberNum}'s score: ${infor.record.score}`)
  if (score <= 60) {
    infor.union.position = 'registry'
    createSdbdataSaver(createMemberIndex(memberNum), infor)
  }
  if (score <= 30) {
    deleteMember(memberNum)
  }
  createSdbdataSaver(createMemberIndex(memberNum), infor)
  return {
    status: 'ok',
    details: {
      do: 'calc',
      score,
    },
  }
}
