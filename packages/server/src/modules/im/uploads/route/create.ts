import { existsSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { createSdbdataSaver, createSdbdataParser } from '../../../utils'
import { UploadFile } from './item'

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
  fileContent.details[item.id] = item
  fileIndexDataExplorer.save(fileContent)
}
