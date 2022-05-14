/** @format */

import { fileIndexDataExplorer } from "./create";
export const deleteItemInIndexData = (itemId: string) => {
  const fileContent = fileIndexDataExplorer.open();
  delete fileContent.details[itemId];
  fileIndexDataExplorer.save(fileContent);
};
