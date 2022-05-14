/** @format */

import {
  createPersonNumberAnalyzor,
  createSdbdataParser,
  createSdbdataSaver,
} from "../../../..//utils";
import { tmpdir } from "os";
import { resolve } from "path";
import { existsSync } from "fs";

export default (person: number, id: string, reason: string) => {
  try {
    const ana = createPersonNumberAnalyzor(person);
    const temppath = resolve(
      tmpdir(),
      `../magnifique/${ana.gradeid}/${ana.classid}/deduction.sdbdata`
    );
    if (existsSync(temppath)) {
      let data = createSdbdataParser(temppath);
      data.details[id].status = "failed";
      data.details[id].msgs.turndown = reason;
      createSdbdataSaver(temppath, data);
      return {
        status: "ok",
      };
    } else {
      return {
        status: "error",
        reason: "not-exists",
      };
    }
  } catch (e) {
    return {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
};
