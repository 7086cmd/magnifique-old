import { tmpdir } from 'os'
import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'
import analyzePerson from '../utils/analyze-person'

export default (numb: number) => {
    const ana = analyzePerson(numb)
    const temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/${numb}.sdbdata`)
    if (existsSync(temppath)) {
        try {
            rmSync(temppath, {
                force: true,
            })
            return {
                status: 'ok',
            }
        } catch (e) {
            return {
                status: 'error',
                reason: 'type-error',
                text: new Error(<string>e).message,
            }
        }
    } else {
        return {
            status: 'error',
            reason: 'not-exists',
        }
    }
}
