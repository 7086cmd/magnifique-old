/** @format */

import { writeFileSync, readFileSync } from "fs";
import { parse } from "./src/parse";
import { stringify } from "./src/stringify";

export const file = {
  save(pth: import("fs").PathLike, ctn: object) {
    writeFileSync(pth, stringify(ctn));
  },
  open(pth: import("fs").PathLike) {
    return parse(readFileSync(pth).toString());
  },
};

export { parse, stringify };
