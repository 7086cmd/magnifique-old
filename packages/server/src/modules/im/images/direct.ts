/**
 * <summary>
 * Steps:
 * 1. get the id of the order in index
 * 2. get the loc
 * 3. read file sync
 * </summary>
 */

import { readFileSync } from 'fs'
import { fileIndexDataExplorer } from '../uploads/route/create'

export const directedDownloadImage = (id: string) => {
  const ctn = fileIndexDataExplorer.open().details[id]
  if (ctn.mime.startsWith('image/')) return readFileSync(ctn.location)
  else return Buffer.from('不是图片，无法使用直链下载。')
}
