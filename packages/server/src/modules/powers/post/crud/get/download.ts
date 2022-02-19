import { resolve } from 'path'
import { readFileSync } from 'fs'
import { tmpdir } from 'os'
import { createSdbdataParser, createPersonNumberAnalyzor } from '../../../../utils'

export default (id: string, person: number) => {
  const { gradeid, classid } = createPersonNumberAnalyzor(person)
  const tp = resolve(tmpdir(), '..', 'magnifique', String(gradeid), String(classid), 'post.sdbdata')
  const data = createSdbdataParser(tp)
  return readFileSync(data.details[id].path)
}
