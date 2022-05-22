/** @format */

import { parse as toObj } from "json5";

export function parse(str: string) {
  const enc = Buffer.from(str, "base64").toString();
  return toObj(enc) as object;
}
