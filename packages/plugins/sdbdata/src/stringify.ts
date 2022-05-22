/** @format */

import { stringify as toJSON5 } from "json5";

export function stringify(obj: object) {
  const str = toJSON5(obj);
  return Buffer.from(str).toString("base64");
}
