export default () => {
  return {
    name: '',
    number: 0,
    youth: 'none',
    volunteer: {
      time: 0,
      details: {},
    },
    deduction: {
      total: 0,
      details: {},
    },
    document: {
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
      leader: false,
      position: 'clerk',
      duty: [],
      admin: [],
      view: [],
      department: '',
    },
    password: '',
    record: {
      actions: 0,
      score: 100,
      violation: 0,
    },
  } as member
}
