/**
 * <summary>
 * Steps:
 * 1. Generate A Item Desc Object
 * Tip: If duplicate, add the group and "flash upload"
 * 2. Write them into index
 * 3. Generate the ID
 * 4. Return
 * </summary>
 */

import { File } from '@koa/multer'
import dayjs from 'dayjs'
import { rmSync } from 'fs'
import { uniq } from 'lodash'
import { createTextMessageCreation } from '../../messages/crud'
import { createItem, fileIndexActions } from '../route'

export const uploadedFileHandler = (file: File, uploader: string, room: string, isGetitInMessage: boolean, filename?: string) => {
  const fileItem = createItem({
    file,
    username: uploader,
    roomId: room,
    filename,
  })
  const fileList = fileIndexActions.fileIndexDataExplorer.open()
  let duplicate: string | undefined = undefined
  Object.entries(fileList.details).forEach(item => {
    let index = item[0]
    if (item[1].hash === fileItem.hash) {
      fileList.details[index].inGroup.push(room)
      fileList.details[index].inGroup = uniq(fileList.details[index].inGroup)
      rmSync(fileItem.location)
      fileIndexActions.fileIndexDataExplorer.save(fileList)
      // Flash Upload
      duplicate = index
    }
  })
  isGetitInMessage &&
    createTextMessageCreation(room, {
      creator: uploader,
      content: duplicate ? fileList.details[duplicate].id : fileItem.id,
      type: 'file',
      status: {},
      createDate: dayjs().toJSON(),
    })
  if (duplicate)
    return {
      status: 'ok',
      details: fileList.details[duplicate],
    }
  fileIndexActions.createItemInIndexData(fileItem)
  return {
    status: 'ok',
    details: fileItem,
  }
}
