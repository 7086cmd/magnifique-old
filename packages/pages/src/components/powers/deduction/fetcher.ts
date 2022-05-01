import axios from 'axios'
import deduction from '../../../../examples/deduction'
import { createDeductionConfig } from './config'

class DeductionFetcher {
  options: DeductionFetch.deductionFetcherConfig

  deductionExample: deduction

  constructor(option: fetcherOptions) {
    this.options = createDeductionConfig(option)
    this.deductionExample = deduction()
    if (option.type === 'member') {
      this.deductionExample.deductor.number = option.number
      this.deductionExample.deductor.name = option.name
    }
  }

  get = async () => {
    const result = await axios(this.options.url, { params: this.options.standardConfig })
    return result.data
  }

  delete = async (deductionDeleteData: { id: string; unviolatedPersonNumber: number }) => {
    if (this.options.deleter) {
      return (
        await axios(this.options.url, {
          method: 'delete',
          data: {
            auth: this.options.standardConfig,
            data: {
              id: deductionDeleteData.id,
              person: deductionDeleteData.unviolatedPersonNumber,
            },
          },
        })
      ).data
    } else
      return {
        status: 'error',
        reason: 'no-auth',
      }
  }

  create = async (deductionCreatement: deduction) => {
    if (this.options.creater && this.options.standardConfig.type === 'member') {
      return (
        await axios(this.options.url, {
          method: 'post',
          data: {
            auth: this.options.standardConfig,
            data: {
              id: Number(this.options.standardConfig.number),
              content: JSON.parse(JSON.stringify(deductionCreatement)),
            },
          },
        })
      ).data
    } else
      return {
        status: 'error',
        reason: 'no-auth',
      }
  }
}

export { DeductionFetcher }
