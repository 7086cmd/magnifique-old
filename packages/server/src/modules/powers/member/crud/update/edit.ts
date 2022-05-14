/** @format */

import { existsSync } from "fs";
import {
  createMemberIndex,
  createSdbdataParser,
  createSdbdataSaver,
  createTypeError,
  createUserDataError,
} from "../../../../utils";

export default (numb: number, rule: string) => {
  const temppath = createMemberIndex(numb);
  if (existsSync(temppath)) {
    try {
      let oldData = createSdbdataParser(temppath) as member;
      // oldData.union.position = toPosition
      // if (toPosition === 'vice-minister') {
      //   oldData.union.admin = oldData.union.duty
      // } else if (toPosition === 'clerk') {
      //   oldData.union.admin = []
      // } else {
      //   throw '无法转为该身份'
      // }
      if (!rule.startsWith("patch |")) throw "错误的处理命令。";
      const after = rule.split(" -> (")[1].split(")")[0];
      const [department, position] = after.split("_");
      oldData.union.department = department;
      oldData.union.position = position as member["union"]["position"];
      createSdbdataSaver(temppath, oldData);
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
