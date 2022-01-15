import getAllMembers from './get-all-members'

export default (department: string) => {
  try {
    let data = getAllMembers().details
    let resu = []
    for (let i = 0; i in data; i++) {
      if (data[i].in == department) {
        resu.push(data[i])
      }
    }
    return {
      status: 'ok',
      details: resu,
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
