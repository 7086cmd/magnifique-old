import { tmpdir } from 'os'
import dataSave from '../utils/data-save'
import dataOpen from '../utils/data-open'
import analyzePerson from '../utils/analyze-person'
import { existsSync } from 'fs'
import { resolve } from 'path'
import dayjs from 'dayjs'

export default (
  numb: number,
  id: string,
  config: {
    title: string
    type: '小说' | '散文' | '诗歌' | '说明文' | '议论文' | '其他'
    description: string
  }
) => {
  try {
    const ana = analyzePerson(numb)
    const temppath = resolve(tmpdir(), `..`, `magnifique`, `${ana.gradeid}`, `${ana.classid}`, `post.sdbdata`)
    if (!existsSync(temppath)) {
      return {
        status: 'error',
        reason: 'not-exists',
      }
    }
    const list = dataOpen(temppath)
    list.details[id] = {
      ...config,
      person: numb,
      time: dayjs().toJSON(),
      path: resolve(tmpdir(), `..`, `magnifique`, `${ana.gradeid}`, `${ana.classid}`, `posts`, id + '.docx'),
    } as post
    dataSave(temppath, list)
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
}
