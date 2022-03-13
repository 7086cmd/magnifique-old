import { createRoom } from 'packages/server/src/modules/im/rooms/crud/create/create-room'
import { readMyRoom } from 'packages/server/src/modules/im/rooms/crud/read/read-rooms'

// createRoom({
//   title: '你好',
//   description: '你猜',
//   users: ['member/20201108', 'class/2/11'],
// })

console.log(readMyRoom('member/20201108'))
