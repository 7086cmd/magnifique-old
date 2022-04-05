import { File } from '@koa/multer'
export namespace UploadFile {
  export interface Item {
    name: string
    id: string
    hash: string
    location: string
    uploadDate: string
    inGroup: string[]
    uploader: string
    mime: string
  }
  export interface CreateItemOptions {
    file: File
    roomId: string
    username: string
  }
  export interface FileStruct {
    details: Record<string, Item>
  }
}
