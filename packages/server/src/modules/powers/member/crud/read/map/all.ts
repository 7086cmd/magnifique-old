/** @format */

import { createYearTransformer } from "packages/client/src/modules/utils";
import getDepartmentData from "packages/server/src/modules/database/get-department-data";
import { getSingleMemberAsRaw } from "..";
import getClass from "../get-class";
import getCore from "../get-core";
import getDepartment from "../get-department";

interface option {
  label: string;
  value: string;
  children?: option[];
}
const createClassName = (gradeid: number, classid: number) => {
  const grades = ["", "初一", "初二", "初三"];
  const gradeids = [1, 2, 3];
  let gradeid_new = gradeid;
  gradeids.forEach((item) => {
    if (createYearTransformer(item) === gradeid) {
      gradeid_new = item;
    }
  });
  return `${grades[gradeid_new]}（${classid}）班`;
};

const asDepartmentWithPosition = () => {
  const data = asDepartment();
  const result: option[] = [];
  data.forEach((departmentItem) => {
    result.push({
      label: departmentItem.label,
      value: departmentItem.value,
      children: [
        {
          label: "主席",
          value: departmentItem.value + "_chairman",
          children: [],
        },
        {
          label: "副主席",
          value: departmentItem.value + "_vice-chairman",
          children: [],
        },
        {
          label: "部长",
          value: departmentItem.value + "_minister",
          children: [],
        },
        {
          label: "副部长",
          value: departmentItem.value + "_vice-minister",
          children: [],
        },
        {
          label: "干事",
          value: departmentItem.value + "_clerk",
          children: [],
        },
        {
          label: "非注册成员",
          value: departmentItem.value + "_register",
          children: [],
        },
      ],
    });
    departmentItem.children?.forEach((person) => {
      const personInfo = getSingleMemberAsRaw(Number(person.value)).details;
      const positionValue =
        departmentItem.value + "_" + personInfo?.union.position;
      result
        .filter((item) => item.value === departmentItem.value)[0]
        .children?.filter((item) => {
          if (departmentItem.value !== "core") {
            if (
              [
                departmentItem.value + "_register",
                departmentItem.value + "_clerk",
                departmentItem.value + "_vice-minister",
                departmentItem.value + "_minister",
              ].includes(positionValue) &&
              positionValue === item.value
            ) {
              return true;
            } else if (
              departmentItem.value + "_vice-chairman" ===
              positionValue
            ) {
              if (personInfo?.union.admin.includes("member-volunteer")) {
                if (item.value === departmentItem.value + "_vice-minister")
                  return true;
              } else {
                if (item.value === departmentItem.value + "_clerk") return true;
              }
            }
          } else if (
            departmentItem.value === "core" &&
            item.value ===
              departmentItem.value + "_" + personInfo?.union.position
          ) {
            return true;
          } else return false;
        })[0]
        .children?.push({
          value: String(personInfo?.number),
          label: personInfo?.name as string,
        });
    });
    result.filter((item) => item.value === departmentItem.value)[0].children =
      result
        .filter((item) => item.value === departmentItem.value)[0]
        .children?.map((item) => {
          if (item.children?.length === 0) {
            item.children = [];
            item.children[0] = {
              label: "不存在",
              value: "not",
            };
          }
          return item;
        })
        .filter((item) => {
          if (departmentItem.value === "core") {
            return (
              item.value.includes("chairman") ||
              (item.value.includes("minister") &&
                !item.value.includes("vice-minister"))
            );
          } else {
            return (
              item.value.includes("register") ||
              item.value.includes("clerk") ||
              item.value.includes("minister")
            );
          }
        });
  });
  return result;
};

const asDepartment = () => {
  const memberOptions = [] as option[];
  const departments = getDepartmentData().details.departments;
  memberOptions.push({
    label: "骨干成员",
    value: "core",
    children: [],
  });
  getCore().details.forEach((item) => {
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
    const departmentMembers = getDepartment(key).details;
    departmentMembers.forEach((item) => {
      memberOptions
        .filter((x) => x.value === "" + key)[0]
        .children?.push({
          value: "" + item.number,
          label: item.name,
        });
    });
  }
  return memberOptions;
};

const asClass = () => {
  const gradeOptions = [] as option[];
  for (let i = 1; i <= 3; i++) {
    gradeOptions.push({
      label: ["", "初一", "初二", "初三"][i],
      value: "grade_" + createYearTransformer(i),
      children: [],
    });
    for (let j = 1; j <= 15; j++) {
      if (getClass(i, j).details.length > 0) {
        gradeOptions[i - 1].children?.push({
          label: createClassName(i, j),
          value: "class_" + i + "_" + j,
          children: [],
        });
        getClass(i, j).details.forEach((item) => {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          (gradeOptions[i - 1].children as option[])
            .filter((item) => item.value === "class_" + i + "_" + j)[0]
            .children?.push({
              label: item.name,
              value: item.number.toString(),
            });
        });
      }
    }
  }
  return gradeOptions.filter((item) => item.children?.length !== 0);
};

export const asAll = { asDepartment, asClass, asDepartmentWithPosition };
