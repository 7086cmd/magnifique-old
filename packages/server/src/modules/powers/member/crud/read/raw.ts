/** @format */

import { createMemberIndex, createSdbdataParser } from "../../../../utils";
import { existsSync } from "fs";

export default (num: number) => {
  const tempdir = createMemberIndex(num);
  if (existsSync(tempdir)) {
    const ctn = createSdbdataParser(tempdir);
    return {
      status: "ok",
      details: ctn as member,
    };
  } else {
    return {
      status: "error",
      reason: "not-exists",
    };
  }
};
