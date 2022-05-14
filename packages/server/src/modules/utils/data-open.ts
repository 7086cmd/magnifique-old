/** @format */

import { PathLike, readFileSync } from "fs";
import decodeBase64 from "./decode-base64";
import { parse } from "json5";
import { resolve } from "path";
import { tmpdir } from "os";

export default (path: PathLike) => {
  if (path.toString().startsWith(resolve(tmpdir(), "..", "magnifique")))
    return parse(decodeBase64(readFileSync(path).toString()));
  else throw "Secure Problem: Can not open the file not in magnifique folder.";
};
