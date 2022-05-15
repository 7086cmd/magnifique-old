/** @format */

import { existsSync } from "fs";
import { uniq } from "lodash";
import getDepartmentData from "packages/server/src/modules/database/get-department-data";
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
      if (!rule.startsWith("patch |")) throw "错误的处理命令。";
      const after = rule.split(" -> (")[1].split(")")[0];
      const [department, position] = after.split("_");
      oldData.union.department = department;

      if (position.includes("chairman") || position === "minister")
        oldData.union.leader = true;
      else oldData.union.leader = false;

      if (position.includes("minister"))
        oldData.union.admin.push("member-volunteer");
      else
        oldData.union.admin = oldData.union.admin.filter(
          (x) => x === "member-volunteer"
        );
      if (position === "minister") oldData.union.admin.push("member");
      else
        oldData.union.admin = oldData.union.admin.filter((x) => x !== "member");

      if (department !== "") {
        let dep = getDepartmentData().details.departments;
        if (department in dep) {
          oldData.union.duty.push(...dep[department].duty);
          oldData.union.admin.push(...dep[department].duty);
        }
      } else {
        oldData.union.admin = oldData.union.admin.filter(
          (x) => !x.includes("member")
        );
        oldData.union.duty = [];
      }

      if (position === "register") {
        oldData.union.duty = [];
        oldData.union.admin = [];
      }

      if (
        !(
          oldData.union.position.includes("chairman") ||
          oldData.union.position.includes("minister")
        )
      )
        oldData.union.admin = [];

      oldData.union.admin = uniq(oldData.union.admin);
      oldData.union.duty = uniq(oldData.union.duty);

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
