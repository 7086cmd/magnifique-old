import baseurl from '../../../modules/baseurl'

const createDeductionConfig = (fetcherInput: fetcherOptions): DeductionFetch.deductionFetcherConfig => {
  if (fetcherInput.type === 'admin') {
    return {
      type: 'admin',
      getter: true,
      deleter: true,
      creater: false,
      standardConfig: fetcherInput,
      url: baseurl + `admin/deduction`,
    }
  } else if (fetcherInput.type === 'member_admin') {
    return {
      type: 'member_admin',
      getter: true,
      deleter: true,
      creater: false,
      url: baseurl + `member/admin/deduction`,
      standardConfig: fetcherInput,
    }
  } else if (fetcherInput.type === 'member') {
    return {
      type: 'member',
      getter: true,
      deleter: true,
      creater: true,
      url: baseurl + `member/deduction`,
      standardConfig: fetcherInput,
      name: fetcherInput.name,
    }
  } else {
    return {
      type: 'class',
      getter: true,
      deleter: false,
      creater: false,
      url: baseurl + `class/deduction`,
      standardConfig: fetcherInput,
    }
  }
}

export { createDeductionConfig }
