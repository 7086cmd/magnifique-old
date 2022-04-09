import { fileIndexDataExplorer } from './create'
export const createUploadedFileItemReader = (id: string) => fileIndexDataExplorer.open().details[id]
