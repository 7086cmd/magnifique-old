/** @format */

/**
 * changelog
 */

import { body } from "./changelog";

let versions: Record<string, string> = {};
body
  .trim()
  .split("<!-- Update. -->")
  .map((x) => x.trim())
  .filter((_val, idx) => idx !== 0)
  .map((item) => {
    let version = item.split("\n")[0].replaceAll("#", "").trim();
    versions[version] = item;
  });

const getv = () => versions;
export { getv as content };
