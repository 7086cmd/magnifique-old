/** @format */

import { existsSync, rmSync } from "fs";
import { resolve } from "path";
import { tmpdir } from "os";
import { getSingleMemberAsRaw } from "../../../member";
import {
  createMemberIndex,
  createPersonNumberAnalyzor,
  createSdbdataParser,
  createSdbdataSaver,
} from "../../../../utils";

export default (number: number, id: string) => {
  try {
    const perss = createPersonNumberAnalyzor(number);
    const temppath = resolve(
      tmpdir(),
      "..",
      "magnifique",
      String(perss.gradeid),
      String(perss.classid),
      "post.sdbdata"
    );
    const data = createSdbdataParser(temppath) as {
      details: Record<string, post>;
    };
    if (existsSync(createMemberIndex(number))) {
      const memberdetail = getSingleMemberAsRaw(number).details as member;
      delete memberdetail.post.details[id];
      createSdbdataSaver(createMemberIndex(memberdetail.number), memberdetail);
    }
    const path = data.details[id].path;
    rmSync(resolve(path));
    delete data.details[id];
    createSdbdataSaver(temppath, data);
    return {
      status: "ok",
    };
  } catch (e) {
    return {
      status: "error",
      reason: "type-error",
      text: new Error(e).message,
    };
  }
};
