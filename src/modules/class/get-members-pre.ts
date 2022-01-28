/* eslint-disable prefer-const */
import { tmpdir } from 'os'
import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import decodeBase64 from '../utils/decode-base64'
import transformDate from '../utils/transform-date'
import { parse } from 'json5'
import objectToArray from '../utils/object-to-array'

export default (gradeid: number, classid: number) => {
  if ([1, 2, 3].includes(gradeid)) {
    gradeid = transformDate(gradeid)
  }
  const dirpth = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/members/pre/`)
  const membersMap = readdirSync(dirpth)
  let base: object = {}
  for (let i in membersMap) {
    if (membersMap[i] !== 'pre') {
      const ctdir = resolve(dirpth, membersMap[i])
      const ctn = parse(decodeBase64(readFileSync(ctdir).toString()))
      base[membersMap[i].replace('.sdbdata', '')] = ctn
    }
  }
  return {
    status: 'ok',
    details: objectToArray('number', base) as member[],
  }
}
