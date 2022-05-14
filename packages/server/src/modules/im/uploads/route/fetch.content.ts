/** @format */

import { fileIndexDataExplorer } from "./create";
export const createUploadedFileItemReader = (id: string) => {
  return fileIndexDataExplorer.open().details[id];
};
