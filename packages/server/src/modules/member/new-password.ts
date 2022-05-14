/** @format */

import { existsSync } from "fs";
import { sha512 } from "js-sha512";
import {
  createMemberIndex,
  createSdbdataParser,
  createSdbdataSaver,
  createENBase64,
} from "../utils";

export default (person: number, newPwd: string) => {
  let temppath = createMemberIndex(person);
  if (existsSync(temppath)) {
    try {
      let old = createSdbdataParser(temppath);
      old.password = sha512(createENBase64(newPwd));
      createSdbdataSaver(temppath, old);
      return {
        status: "ok",
      };
    } catch (e) {
      return {
        status: "error",
        reason: "type-error",
        text: new Error(<string>e).message,
      };
    }
  } else {
    return {
      status: "error",
      reason: "not-exists",
    };
  }
};
