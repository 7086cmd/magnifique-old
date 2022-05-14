/** @format */

import { existsSync, rmSync } from "fs";
import {
  createMemberIndex,
  createTypeError,
  createUserDataError,
} from "../../../../utils";

export default (numb: number) => {
  const temppath = createMemberIndex(numb);
  if (existsSync(temppath)) {
    try {
      rmSync(temppath, {
        force: true,
      });
      return {
        status: "ok",
      };
    } catch (e) {
      return createTypeError(e);
    }
  } else {
    return createUserDataError("not-exists");
  }
};
