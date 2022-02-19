import { parse } from 'json5'
import { createObjectToArrayTransformer, createClassDataReader } from '../../../../utils'

export default (gradeid: number, classid: number) => {
  const docsClass = createObjectToArrayTransformer('id', parse(createClassDataReader('deduction', gradeid, classid)).details) as DeductionList[]
  return {
    status: 'ok',
    details: docsClass,
  }
}
