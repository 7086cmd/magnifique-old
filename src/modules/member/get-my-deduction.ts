import getAllDeductions from '../admin/get-all-deductions'

export default (num: number) => {
  try {
    const list = getAllDeductions()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let base: any[] = []
    for (let i = 0; i in list.details; i++) {
      if (list.details[i].deductor.number == num) {
        base.push(list.details[i])
      }
    }
    return {
      status: 'ok',
      details: base,
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
