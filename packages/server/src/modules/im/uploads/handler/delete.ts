/**
 * <summary>
 * Steps:
 * 1. Read the index file and find the file
 * Tip: If there are many groups use this file, delete this group. If there is only one, delete the hole file and the config.
 * 2. Write them into index
 * 3. Delete File
 * 4. Return
 * </summary>
 */

import { rmSync } from 'fs'
import { fileIndexActions } from '../route'

export const deleteFileHandler = (fileId: string, roomId: string) => {
  const index = fileIndexActions.fileIndexDataExplorer.open()
  const item = index.details[fileId]
  if (item.inGroup.includes(roomId) && item.inGroup.length > 1) {
    index.details[fileId].inGroup = item.inGroup.filter(item => item !== roomId)
    return {
      status: 'ok',
    }
  }
  delete index.details[fileId]
  rmSync(item.location)
  return {
    status: 'ok',
  }
}
