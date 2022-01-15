import { tmpdir } from 'os'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { stringify } from 'json5'
import encoder from '../utils/encode-base64'
import analyzePerson from '../utils/analyze-person'
import { sha512 } from 'js-sha512'

export default (configuration: {
  name: string
  number: number
  in: 'xue-xi' | 'qing-zhi' | 'zu-zhi' | 'xuan-chuan' | 'wen-ti' | 'ji-jian' | 'chair-man'
  type: 'zhu-xi' | 'fu-zhu-xi' | 'bu-zhang' | 'fu-bu-zhang' | 'gan-shi'
  vadmin?: 'qing-ti' | 'xue-jian' | 'tuan-zong-zhi' | 'bu-zhang'
}) => {
  const ana = analyzePerson(configuration.number)
  let temppath = resolve(tmpdir(), `../magnifique/${ana.gradeid}/${ana.classid}/members/`)
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${configuration.number}.sdbdata`)
      configuration['record'] = {
        actions: 0,
        score: 100,
        violation: 0,
      }
      configuration['workflows'] = {}
      configuration['password'] = sha512(encoder(String(configuration.number)))
      writeFileSync(temppath, encoder(stringify(configuration)))
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
