import { createRoom } from 'packages/server/src/modules/im/rooms/crud/create/create-room'
import { readMyRooms } from 'packages/server/src/modules/im/rooms/crud/read/read-rooms'

// createRoom({
//   title: '你好',
//   description: '你猜',
//   users: ['member/20201108', 'class/2/11'],
// })

console.log(readMyRooms('member/20201108'))
