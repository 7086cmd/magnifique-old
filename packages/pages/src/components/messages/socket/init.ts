import baseurl from '../../../modules/baseurl'
import { io, Socket } from 'socket.io-client'
// import { SubscribeContent } from 'packages/server/src/modules/im/ntfc'

interface MessageRoomSubscriborOptions {
  account: string
  password: string
  roomId: string
  refresher: (roomId: string) => void
}

interface SubscribeContent {
  type: 'message' | 'deduction'
  method: 'patch' | 'delete' | 'post'
  id: string
  title: string
  actioner: string
  receiver: string
  actioner_name: string
  receiver_name: string
}

export { MessageRoomSubscriborOptions }

export class MessageRoomSubscribor {
  socket: Socket
  roomId: string
  myself: string
  refresher: (roomId: string) => void
  constructor(options: MessageRoomSubscriborOptions) {
    const params = new URLSearchParams()
    params.set('username', options.account)
    params.set('password', options.password)
    params.set('roomId', options.roomId)
    this.roomId = options.roomId
    this.myself = options.account
    // const socket =
    let url = ''
    if (import.meta.env.PROD) {
      url = window.location.href
    } else {
      url = baseurl
    }
    const URI = new URL(url)
    URI.protocol = 'ws:'
    URI.pathname = '/'
    URI.search = params.toString()
    const socket = io(URI.toString())
    this.socket = socket
    this.refresher = options.refresher
  }
  unsubscribe() {
    this.socket.disconnect()
  }
  subscribe() {
    this.socket.on('message', (data: SubscribeContent) => {
      if (data.id === this.roomId && data.receiver === this.myself) {
        this.refresher(this.roomId)
      }
    })
  }
  clone = () => Object.assign({}, this)
}
