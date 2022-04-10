import { createSdbdataSaver } from 'packages/server/src/modules/utils'
import { deleteFileHandler } from '../../..'
import { createSingleRoomItemGetter } from '../../../rooms/crud'
import createPath from '../../../utils/create-path'

const createMessageDeletion = (roomId: string, messageId: string, actioner: string) => {
  const roomFileContent = createSingleRoomItemGetter(roomId)
  if (roomFileContent.details[messageId].creator !== actioner) {
    return {
      status: 'error',
      reason: 'no-auth',
    }
  }
  if (roomFileContent.details[messageId].type === 'file') deleteFileHandler(roomFileContent.details[messageId].content, roomId)
  delete roomFileContent.details[messageId]
  createSdbdataSaver(createPath(roomId), roomFileContent)
  return {
    status: 'ok',
  }
}

export { createMessageDeletion }
