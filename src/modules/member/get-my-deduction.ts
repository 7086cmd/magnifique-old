import getAllDeductions from '../admin/get-all-deductions'

export default (num: number) => {
  try {
    const list = getAllDeductions() as {
      status: string
      details: DeductionList[]
    }

    return {
      status: 'ok',
      details: list.details.filter((item) => item.deductor.number === num),
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
