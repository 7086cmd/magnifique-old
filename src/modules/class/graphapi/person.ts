/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import getContentClass from '../get-content-class'
import objectToArray from '../../utils/object-to-array'
import { parse } from 'json5'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export default (gradeid: number, classid: number, start: string, end: string) => {
    const objList = getContentClass('deduction', gradeid, classid)
    const arrList: any[] = objectToArray('id', parse(objList).details)
    const base: {
        columns: string[]
        rows: {
            个人: string
            扣分数: number
        }[]
    } = {
        columns: ['个人', '扣分数'],
        rows: [],
    }
    let list = {}
    for (let i = 0; i in arrList; i++) {
        if (dayjs(arrList[i].time).isBetween(dayjs(start), dayjs(end))) {
            if (list[<string>arrList[i].person] == undefined) {
                list[<string>arrList[i].person] = 0
            }
            list[<string>arrList[i].person] += arrList[i].deduction
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let key: string, val: any
    for ([key, val] of Object.entries(list)) {
        base.rows.push({
            个人: <string>key,
            扣分数: Math.floor(val / 0.05) * 0.05,
        })
    }
    return base
}
