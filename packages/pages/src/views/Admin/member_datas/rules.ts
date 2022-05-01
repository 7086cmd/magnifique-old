import dayjs from 'dayjs'
import type { FormRules } from 'element-plus'
import analyzePerson from '../../../modules/utils/analyze-person'
export const AddMemberFormRule = {
  name: [
    { required: true, message: '姓名为必填项', trigger: 'blur ' },
    { min: 2, max: 4, message: '姓名格式不对', trigger: 'blur' },
  ],
  number: [
    { required: true, message: '学号为必填项', trigger: 'blur' },
    {
      validator(_rule, value: string, callback) {
        if (!Number.isInteger(value)) callback(new Error('输入的不是整数'))
        const val = analyzePerson(Number(value))
        if (Math.abs(dayjs().year() - val.gradeid) > 3) callback(new Error('这个年级不存在'))
        if (val.classid > 20) callback(new Error('没有这么多班级'))
        if (val.number > 60) callback(new Error('一个班级没有这么多人叭'))
      },
      trigger: 'blur',
    },
  ],
  'union.position': [
    { required: true, message: '职位是必填项', trigger: 'blur' },
    {
      validator(_rule, value: string, callback) {
        if (!['registry', 'none', 'clerk', 'vice-minister', 'minister', 'vice-chairman', 'chairman'].includes(value)) callback(new Error('职位不对'))
      },
    },
  ],
} as FormRules
