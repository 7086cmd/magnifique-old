import getDepartmentData from '../database/get-department-data'
import getPublicPower from '../database/get-public-power'

export default (configuration: member) => {
  const groups = getDepartmentData()
  const types = {
    chairman: '主席',
    'vice-chairman': '副主席',
    minister: '部长',
    'vice-minister': '副部长',
    clerk: '干事',
    '': '无部门',
  }
  let base: Record<string, boolean | number | string | Record<'actions' | 'score' | 'violation', number> | string[]>
  const publicPower = getPublicPower()
  const duties: string[] = []
  for (let i = 0; i in configuration.union.duty; i++) {
    duties.push(publicPower.details.power[configuration.union.duty[i]].name)
  }
  const admins: string[] = []
  for (let i = 0; i in configuration.union.admin; i++) {
    if (configuration.union.admin[i] === 'member') {
      admins.push('成员')
    } else {
      try {
        admins.push(publicPower.details.power[configuration.union.admin[i]].name)
      } catch (_e) {
        admins.push(configuration.union.admin[i])
      }
    }
  }
  try {
    base = {
      name: configuration.name,
      number: configuration.number,
      in: groups.details.departments[configuration.union.department].name,
      do: '',
      icg: false,
      record: configuration.record,
      duty: duties,
      admin: admins,
    }
  } catch (_e) {
    base = {
      name: configuration.name,
      number: configuration.number,
      in: '无部门',
      do: '',
      icg: false,
      record: configuration.record,
      duty: duties,
      admin: admins,
    }
  }
  if (configuration.union.position.includes('chairman')) {
    base.do = types[configuration.union.position]
    base.icg = true
  } else if (configuration.union.position == 'minister') {
    base.do = groups.details.departments[configuration.union.department].name + types[configuration.union.position]
    base.icg = true
  } else if (['vice-minister', 'clerk'].includes(configuration.union.position)) {
    base.do = groups.details.departments[configuration.union.department].name + types[configuration.union.position]
    base.icg = false
  } else {
    base.do = '非正式成员'
    base.icg = false
  }
  return base
}
