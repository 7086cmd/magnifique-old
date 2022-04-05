import { v4 } from 'uuid'
import { existsSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { createSdbdataSaver, createSdbdataParser } from '../../../utils'
import { UploadFile } from './item'
import dayjs from 'dayjs'

export const defaultPath = resolve(tmpdir(), '..', 'magnifique', 'storage', 'index.sdbdata')

if (!existsSync(defaultPath)) createSdbdataSaver(defaultPath, { details: {} })

const openFileIndexData: () => {
  details: Record<string, UploadFile.Item>
} = () => createSdbdataParser(defaultPath)

const saveFileIndexData = (val: { details: Record<string, UploadFile.Item> }) => createSdbdataSaver(defaultPath, val)

export const fileIndexDataExplorer = {
  save: saveFileIndexData,
  open: openFileIndexData,
}

export const createItemInIndexData = (item: UploadFile.Item) => {
  const fileContent = fileIndexDataExplorer.open()
  // fileContent.details[item.id]
  let id = v4()
  while (fileContent.details[id] !== undefined) id = v4()
  item.id = id
  item.uploadDate = dayjs().toJSON()
  fileContent.details[id] = item
  fileIndexDataExplorer.save(fileContent)
}
