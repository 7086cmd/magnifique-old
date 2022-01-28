import dataOpen from '../utils/data-open'
import { tmpdir } from 'os'
import { resolve } from 'path'

export default () => {
  return {
    status: 'ok',
    details: dataOpen(resolve(tmpdir(), '..', 'magnifique', 'departments.sdbdata')) as department,
  }
}
