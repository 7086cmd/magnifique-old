import { getDepartmentAsRaw } from '../../member'
import createSingleItem from './utils/create-single-item'
import exportOverview from './utils/export-overview'

export default (
  department: string,
  config?: {
    start: string
    end: string
  }
) => {
  let csv = exportOverview()
  const membersInClass = getDepartmentAsRaw(department).details
  membersInClass.forEach((item) => {
    csv += createSingleItem(item.number, config)
  })
  return csv
}
