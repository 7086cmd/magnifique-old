import { SubscribeContent } from './.d'
import { createSingleRoomItemGetter } from '../rooms/crud'
import { getPerson } from '../rooms/crud/read/read-rooms'

const getTitle = (id: string) => createSingleRoomItemGetter(id).config.title

export { getTitle }

const createBody = (method: 'patch' | 'delete' | 'post', act: string, rid: string): SubscribeContent[] => {
  return createSingleRoomItemGetter(rid).config.users.map(item => ({
    type: 'message',
    method: method,
    id: rid,
    title: getTitle(rid),
    actioner: act,
    receiver: item,
    actioner_name: getPerson(act) as string,
    receiver_name: getPerson(item) as string,
  }))
}

export { createBody }
