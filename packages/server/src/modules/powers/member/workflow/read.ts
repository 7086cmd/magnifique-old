/** @format */

import { existsSync } from "fs";
import {
  createMemberIndex,
  createObjectToArrayTransformer,
  createSdbdataParser,
} from "../../../utils";

export default (numb: number) => {
  let temppath = createMemberIndex(numb);
  if (existsSync(temppath)) {
    try {
      const opwd = createSdbdataParser(temppath).workflow.details;
      return {
        status: "ok",
        details: createObjectToArrayTransformer("id", opwd),
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
