import { getAllAsRaw } from '../../member'
import createSingleItem from './utils/create-single-item'
import exportOverview from './utils/export-overview'

export default (config?: { start: string; end: string }) => {
  let csv = exportOverview()
  const membersInClass = getAllAsRaw().details
  membersInClass.forEach((item) => {
    csv += createSingleItem(item, config)
  })
  return csv
}
