import getDepartmentData from '../database/get-department-data'

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
  try {
    base = {
      name: configuration.name,
      number: configuration.number,
      in: groups.details.departments[configuration.union.department].name,
      do: '',
      icg: false,
      record: configuration.record,
      duty: configuration.union.duty,
      admin: configuration.union.admin,
    }
  } catch (_e) {
    base = {
      name: configuration.name,
      number: configuration.number,
      in: '无部门',
      do: '',
      icg: false,
      record: configuration.record,
      duty: configuration.union.duty,
      admin: configuration.union.admin,
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
