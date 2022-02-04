import getContentClass from '../class/get-content-class'
import analyzePerson from '../utils/analyze-person'
import { parse } from 'json5'
import objectToArray from '../utils/object-to-array'

export default (numb: number) => {
  const { gradeid, classid } = analyzePerson(numb)
  const docsClass = objectToArray('id', parse(getContentClass('post', gradeid, classid)).details) as PostList[]
  docsClass.filter((item) => item.person === numb)
  return {
    status: 'ok',
    details: docsClass,
  }
}
