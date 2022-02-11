import { getClassAsRaw } from '../../member'
import createSingleItem from './utils/create-single-item'
import exportOverview from './utils/export-overview'

export default (
  gradeid: number,
  classid: number,
  config?: {
    start: string
    end: string
  }
) => {
  let csv = exportOverview()
  let membersInClass = getClassAsRaw(gradeid, classid).details
  membersInClass.forEach((item) => {
    csv += createSingleItem(item.number, config)
  })
  return csv
}
