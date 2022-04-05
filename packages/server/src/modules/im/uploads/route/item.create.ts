import dayjs from 'dayjs'
import { v1 } from 'uuid'
import { createFileHash } from '../hash/hash'
import { UploadFile } from './item'

export const createItem = (options: UploadFile.CreateItemOptions): UploadFile.Item => ({
  name: options.file.originalname,
  id: v1(),
  hash: createFileHash(options.file.path),
  location: options.file.path,
  inGroup: [options.roomId],
  uploader: options.username,
  uploadDate: dayjs().toJSON(),
  mime: options.file.mimetype,
})
