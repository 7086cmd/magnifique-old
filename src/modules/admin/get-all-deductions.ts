/* eslint-disable prefer-const */
// This is must use array.
import { parse } from 'json5'
import getContentClass from '../class/get-content-class'
import objectToArray from '../utils/object-to-array'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export default (config?: { start: string; end: string }) => {
    let base = []
    const classes = [15, 15, 15]
    for (let i = 1; i in [1, 2, 3]; i++) {
        for (let j = 1; j <= classes[i - 1]; j++) {
            base.push(...objectToArray('id', parse(getContentClass('deduction', i, j)).details))
        }
    }
    if (config == undefined) {
        return {
            status: 'ok',
            details: base,
        }
    } else {
        let list = []
        const startline = dayjs(config.start)
        const endline = dayjs(config.end)
        for (let i = 0; i in base; i++) {
            if (dayjs(base[i].time).isBetween(startline, endline)) {
                list.push(base[i])
            }
        }
        return {
            status: 'ok',
            details: list,
        }
    }
}
