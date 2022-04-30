import { asAll } from './all'

export const asDepartment = {
  default(department: string) {
    return asAll.asDepartment().filter(item => item.value === department)[0]
  },
  withPosition(department: string) {
    return asAll.asDepartmentWithPosition().filter(item => item.value === department)[0]
  },
}
