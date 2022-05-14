/** @format */

import { createYearTransformer } from "packages/pages/src/modules/utils";
import getDepartmentData from "packages/server/src/modules/database/get-department-data";
import getCore from "../get-core";
import getDepartment from "../get-department";

interface option {
  label: string;
  value: string;
  children?: option[];
}

const getDepartmentClass = (
  gradeid: number,
  classid: number,
  department: string
) => {
  const depMembers = getDepartment(department).details;
  return depMembers.filter((member) =>
    member.number
      .toString()
      .startsWith((createYearTransformer(gradeid) * 100 + classid).toString())
  );
};

const getCoreClass = (gradeid: number, classid: number) => {
  const depMembers = getCore().details;
  return depMembers.filter((member) =>
    member.number
      .toString()
      .startsWith((createYearTransformer(gradeid) * 100 + classid).toString())
  );
};

const class_department = (gradeid: number, classid: number) => {
  const memberOptions = [] as option[];
  const departments = getDepartmentData().details.departments;
  memberOptions.push({
    label: "骨干成员",
    value: "core",
    children: [],
  });
  getCoreClass(gradeid, classid).forEach((item) => {
    memberOptions
      .filter((x) => x.value === "core")[0]
      .children?.push({
        value: "" + item.number,
        label: item.name,
      });
  });
  for (let [key, val] of Object.entries(departments)) {
    memberOptions.push({
      label: val.name,
      value: "" + key,
      children: [],
    });
    const departmentMembers = getDepartmentClass(gradeid, classid, key);
    departmentMembers.forEach((item) => {
      memberOptions
        .filter((x) => x.value === "" + key)[0]
        .children?.push({
          value: "" + item.number,
          label: item.name,
        });
    });
  }
  return memberOptions.filter((x) => x.children?.length !== 0);
};

export const asClass = {
  default: class_department,
};
