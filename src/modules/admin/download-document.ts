import { resolve } from 'path'
import { readFileSync } from 'fs'
import { tmpdir } from 'os'
import dataOpen from '../utils/data-open'
import analyzePerson from '../utils/analyze-person'

export default (id: string, person: number) => {
    const { gradeid, classid } = analyzePerson(person)
    const tp = resolve(tmpdir(), './../', 'magnifique', String(gradeid), String(classid), 'document.sdbdata')
    const data = dataOpen(tp)
    return readFileSync(data.details[id].path)
}
