import axios from 'axios'
import { Ref } from 'vue'
import baseurl from '../modules/baseurl'
import { useI18n } from 'vue-i18n'

export default async (
  type: Ref<string | undefined> | undefined,
  numb: Ref<number | undefined> | undefined,
  classid: Ref<number | undefined> | undefined,
  gradeid: Ref<number | undefined> | undefined
) => {
  const { t } = useI18n()
  if (type != undefined) {
    if (type.value == 'class') {
      return t('class-expression', {
        grade: t('class.grades.' + gradeid?.value),
        class: classid?.value,
      })
    } else if (type.value == 'member') {
      return (await axios(`${baseurl}member/getinfo/${numb?.value}/`)).data.details.name
    } else if (type.value == 'admin') {
      return '管理员'
    } else {
      return '我不知道你是谁'
    }
  }
}
