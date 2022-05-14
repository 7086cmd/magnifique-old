/** @format */

const encodeBase64 = (content: string) => {
  return Buffer.from(content).toString("base64");
};
export default encodeBase64;
