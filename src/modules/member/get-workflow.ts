import dataOpen from '../utils/data-open'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'
import objectToArray from '../utils/object-to-array'
import analyzePerson from '../utils/analyze-person'

export default (numb: number) => {
    const ana = analyzePerson(numb)
    let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/`)
    if (existsSync(temppath)) {
        try {
            temppath = resolve(temppath, `./${numb}.sdbdata`)
            const opwd = dataOpen(temppath).workflows
            return {
                status: 'ok',
                details: objectToArray('id', opwd),
            }
        } catch (e) {
            return {
                status: 'error',
                reason: 'type-error',
                text: <string>e,
            }
        }
    } else {
        return {
            status: 'error',
            reason: 'not-exists',
        }
    }
}
