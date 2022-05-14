/** @format */

import {
  createMemberIndex,
  createSdbdataSaver,
  createSdbdataParser,
} from "../../../utils";
import { resolve } from "path";
import { existsSync } from "fs";

export default (numb: number, id: string, status: string) => {
  let temppath = createMemberIndex(numb);
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${numb}.sdbdata`);
      let cfg = createSdbdataParser(temppath) as member;
      cfg.workflow.details[id].status = status;
      createSdbdataSaver(temppath, cfg);
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
