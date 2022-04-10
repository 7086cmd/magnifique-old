import axios from 'axios'
// import baseurl from '../../../modules/baseurl'
import { UploadFile } from './item'
const baseurl = 'http://localhost/api/'

export class FileClient {
  data: { fileId: string; roomId: string }
  auth: { password: string; username: string }
  file: UploadFile.Item
  constructor(data: { fileId: string; roomId: string }, auth: { password: string; username: string }) {
    this.data = data
    this.auth = auth
    this.file = {
      name: '',
      id: '',
      hash: '',
      location: '',
      uploadDate: '',
      inGroup: [],
      uploader: '',
      mime: '',
    }
  }
  fetch = async () => axios(baseurl + 'message/upload', { params: { token: this.data.fileId } }).then(response => (this.file = response.data.details as UploadFile.Item))
}
