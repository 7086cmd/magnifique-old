import axios from 'axios'
import toPort from '../../../modules/to-port'
import baseurl from '../../../modules/baseurl'
import { UploadFile } from './item'
import failfuc from '../../../modules/failfuc'
import type { MessageClient } from './main'
import { ElNotification } from 'element-plus'
// const baseurl = 'http://localhost/api/'

export class FileClient {
  data: { fileId: string; roomId: string; messageId: string }
  auth: { password: string; username: string }
  client: MessageClient
  file: UploadFile.Item
  rf: (par: string) => Promise<void>
  constructor(data: { fileId: string; roomId: string; messageId: string }, auth: { password: string; username: string }, client: MessageClient, rf: (par: string) => Promise<void>) {
    this.data = data
    this.auth = auth
    this.client = client
    this.rf = rf
    this.file = {
      name: '',
      id: '',
      hash: '',
      location: '',
      uploadDate: '',
      inGroup: [],
      uploader: '',
      mime: '',
      size: 0,
    }
  }
  fetch = async () => axios(baseurl + 'message/upload', { params: { id: this.data.fileId } }).then(response => (this.file = response.data.details as UploadFile.Item))
  action = async (method: 'post' | 'delete') => (await axios(baseurl + 'message/upload', { data: { data: this.data, auth: this.auth }, method })).data
  download = async () => {
    const resp = await this.action('post')
    resp.status === 'ok' && window.open(toPort(baseurl + 'file/download?token=' + resp.details.token), '_blank')
    resp.status === 'error' && failfuc(resp.reason, resp.text)
  }
  delete = async () => {
    // const resp = await this.action('delete')
    // resp.status === 'ok' && ElNotification({ title: '删除文件成功', type: 'success' })
    await this.client.deleteMessage(this.data.roomId, this.data.messageId)
    await this.rf(this.data.messageId)
    ElNotification({ title: '文件删除成功', type: 'success' })
  }
}
