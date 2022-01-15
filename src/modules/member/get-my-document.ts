import getContentClass from '../class/get-content-class'
import analyzePerson from '../utils/analyze-person'
import { parse } from 'json5'
import objectToArray from '../utils/object-to-array'

export default (numb: number) => {
  const { gradeid, classid } = analyzePerson(numb)
  const docsClass = objectToArray('id', parse(getContentClass('document', gradeid, classid)).details)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = []
  docsClass.forEach((item) => {
    if (item.uploader == numb) {
      all.push(item)
    }
  })
  return {
    status: 'ok',
    details: all,
  }
}
