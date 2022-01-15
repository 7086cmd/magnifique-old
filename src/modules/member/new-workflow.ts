import dataOpen from '../utils/data-open'
import dataSave from '../utils/data-save'
import analyzePerson from '../utils/analyze-person'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

type workflow = {
    title: string
    description: string
    deadline: string
    importance: number
}

export default (numb: number, workfl: workflow) => {
    const ana = analyzePerson(numb)
    let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/`)
    if (existsSync(temppath)) {
        try {
            temppath = resolve(temppath, `./${numb}.sdbdata`)
            let cfg = dataOpen(temppath)
            let id = v4()
            while (cfg.workflows[id] !== undefined) {
                id = v4()
            }
            workfl['status'] = 'planning'
            workfl['start'] = dayjs().toJSON()
            cfg.workflows[id] = workfl
            dataSave(temppath, cfg)
            return {
                status: 'ok',
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
