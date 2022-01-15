import { tmpdir } from 'os'
import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'
import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import analyzePerson from '../utils/analyze-person'

export default (numb: number) => {
    const ana = analyzePerson(numb)
    const temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/pre/${numb}.sdbdata`)
    const temppathto = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/${numb}.sdbdata`)
    if (existsSync(temppath)) {
        try {
            const oldData = dataOpen(temppath)
            let conf = {
                name: oldData.name,
                number: oldData.number,
                in: oldData.in,
                type: oldData.type,
                record: {
                    actions: 0,
                    score: 100,
                    violation: 0,
                },
                workflows: {},
                password: oldData.password,
            }
            dataSave(temppathto, conf)
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
