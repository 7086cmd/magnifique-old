import dayjs from 'dayjs'
import analyzePerson from '../utils/analyze-person'
import transformDate from '../utils/transform-date'
import getAllDeductions from './get-all-deductions'
const items = ['班级', '违纪者', '扣分数', '扣分原因', '解释说明', '扣分日期', '扣分者', '申斥状况']
const statuses = {
  normal: '正常扣分',
  processing: '正在处理',
  failed: '被驳回',
}
const getclassname = (gradeid: number, classid: number) => {
  let grade = 0
  for (let i = 1; i <= 3; i++) {
    if (transformDate(i) == gradeid) {
      grade = i
      break
    }
  }
  const grades = ['', '初一', '初二', '初三']
  return grades[grade] + '（' + classid + '）班'
}
const imports = (deduc: deduction) => {
  const deductor = analyzePerson(deduc.deductor.number)
  const ana = analyzePerson(deduc.person)
  return [
    getclassname(ana.gradeid, ana.classid),
    deduc.person,
    deduc.deduction,
    deduc.reason,
    deduc.description,
    dayjs(deduc.time).format('YYYY[年]MM[月]DD[日] HH[时]mm[分]ss[秒]'),
    `${deduc.deductor.name}(${getclassname(deductor.gradeid, deductor.classid)})`,
    statuses[deduc.status],
  ]
}

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
export default (config?: { start: string; end: string }) => {
  try {
    const list = getAllDeductions(config).details
    let stri = doit(items)
    for (let i = 0; i in list; i++) {
      stri += doit(imports(list[i]))
    }
    return {
      status: 'ok',
      details: stri,
    }
  } catch (e) {
    return {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
}
