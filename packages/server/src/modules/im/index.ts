import { getOptions as createMemberMap } from 'packages/server/src/modules/im/rooms/utils/fetch-all-user'
import * as roomActions from './rooms'
import * as messageActions from './messages'
import { loginModule } from './auth'
import { createBody } from './ntfc/create-body'
import { uploadedFileHandler, getUploadedFile, deleteFileHandler } from './uploads'
import { createUploadedFileItemReader } from './uploads/route/fetch.content'
import { directedDownloadImage } from './images/direct'

export * from './rooms'
export * from './messages'
export * from './auth'
export * from './ntfc/create-body'
export * from './uploads'

export { createMemberMap, createUploadedFileItemReader, directedDownloadImage }

export default {
  roomActions,
  messageActions,
  loginModule,
  createMemberMap,
  createBody,
  uploadedFileHandler,
  getUploadedFile,
  deleteFileHandler,
  createUploadedFileItemReader,
  directedDownloadImage,
}
