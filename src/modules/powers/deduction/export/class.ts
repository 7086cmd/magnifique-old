import { getClass } from '..'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { createObjectToArrayTransformer, createYearTransformer } from '../../../utils'

dayjs.extend(isBetween)

const items = ['班级', '扣分数']
const doit = (content: object) => {
  return (
    JSON.stringify(content)
      .split('[')
      .filter((word) => word != '')
      .join('[')
      .split(']')
      .filter((word) => word != '')
      .join(']') + '\r\n'
  )
}
const createClassName = (gradeid: number, classid: number) => {
  const grades = ['', '初一', '初二', '初三']
  return grades[gradeid] + '（' + classid + '）班'
}
export default (config: { start: string; end: string }) => {
  let stri = `"开始时间: ${dayjs(config.start).format('YYYY/MM/DD')}"\r\n"结束时间: ${dayjs(config.end).format('YYYY/MM/DD')}"\r\n${doit(items)}`
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 15; j++) {
      let deductiont = 0.0
      const classList = createObjectToArrayTransformer('id', getClass(createYearTransformer(i), j))
      for (let k = 0; k in classList; k++) {
        const startline = dayjs(config.start)
        const endline = dayjs(config.end)
        if (dayjs(classList[k].time).isBetween(startline, endline)) {
          let t = Math.floor(deductiont * 100)
          t += Math.floor(classList[k].deduction * 100)
          deductiont = t / 100
        }
      }
      stri += doit([createClassName(i, j), deductiont])
    }
  }
  return {
    status: 'ok',
    details: stri,
  }
}
