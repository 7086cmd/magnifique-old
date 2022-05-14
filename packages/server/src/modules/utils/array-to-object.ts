/** @format */

const arrayToObject = (insert: string, content: object) => {
  let base = {};
  for (let i = 0; i in content; i++) {
    const key = content[i][insert];
    base[key] = content[i];
    delete base[key][insert];
  }
  return base;
};
export default arrayToObject;
