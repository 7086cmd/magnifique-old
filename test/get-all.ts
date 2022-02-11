import * as utils from '../src/modules/utils'
import { createMember } from '../src/modules/powers/member'
for (let i = 1; i <= 200; i++) {
  const gradeid = utils.createYearTransformer(Math.floor(Math.random() * 2 + 1))
  const classid = Math.floor(Math.random() * 14 + 1)
  const number = Math.floor(Math.random() * 54 + 1)
  const MemberNumber = gradeid * 10000 + classid * 100 + number
  console.log(MemberNumber)
  createMember({
    name: 'vuruweuifdscfuiwe' + MemberNumber,
    number: MemberNumber,
    youth: 'none',
    volunteer: {
      time: 0,
      details: {},
    },
    deduction: {
      total: 0,
      details: {},
    },
    post: {
      total: 0,
      details: {},
    },
    radio: {
      total: 0,
      details: {},
    },
    workflow: {
      total: 0,
      details: {},
    },
    union: {
      leader: true,
      position: 'vice-chairman',
      duty: ['deduction', 'volunteer', 'post', 'radio'],
      admin: ['deduction', 'member', 'post', 'radio', 'volunteer'],
      view: [],
      department: '',
      regist: {
        plan: '',
        position: '',
        prize: '',
        introduce: '',
      },
    },
    password: '',
    record: {
      actions: 0,
      score: 80,
      violation: 0,
    },
  })
}
