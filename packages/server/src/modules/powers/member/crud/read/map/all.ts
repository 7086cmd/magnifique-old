import getDepartmentData from 'packages/server/src/modules/database/get-department-data'
import getCore from '../get-core'
import getDepartment from '../get-department'

interface option {
  label: string
  value: string
  children?: option[]
}

const department = () => {
  const memberOptions = [] as option[]
  const departments = getDepartmentData().details.departments
  memberOptions.push({
    label: '骨干成员',
    value: 'core',
    children: [],
  })
  getCore().details.forEach(item => {
    memberOptions
      .filter(x => x.value === 'core')[0]
      .children?.push({
        value: '' + item.number,
        label: item.name,
      })
  })
  for (let [key, val] of Object.entries(departments)) {
    memberOptions.push({
      label: val.name,
      value: '' + key,
      children: [],
    })
    const departmentMembers = getDepartment(key).details
    departmentMembers.forEach(item => {
      memberOptions
        .filter(x => x.value === '' + key)[0]
        .children?.push({
          value: '' + item.number,
          label: item.name,
        })
    })
  }
  return memberOptions
}

export const all = { department }
