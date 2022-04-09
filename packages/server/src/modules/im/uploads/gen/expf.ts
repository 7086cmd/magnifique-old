import { readFileSync } from 'fs'
import { roomActions } from '../..'
import { fileIndexActions } from '../route'
import { lookup } from 'mime-types'

export const getUploadedFile = (id: string, roomId: string, username: string) => {
  const fileDesc = fileIndexActions.fileIndexDataExplorer.open().details[id]
  const vail1 = fileDesc.inGroup.includes(roomId)
  const vail2 = roomActions.createSingleRoomItemGetter(roomId).config.users.includes(username)
  if (vail1 && vail2) {
    return {
      status: 'ok',
      details: {
        content: readFileSync(fileDesc.location),
        mime: lookup(fileDesc.name),
      },
    }
  } else {
    return {
      status: 'error',
      reason: 'no-auth',
    }
  }
}
