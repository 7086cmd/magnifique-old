/** @format */

import * as map from "./list";

export const getMap = (
  option:
    | {
        type: "department";
        withPosition: boolean;
        department: string;
      }
    | {
        type: "class";
        gradeid: number;
        classid: number;
      }
    | {
        type: "all";
        as: "department";
        withPosition: boolean;
      }
    | {
        type: "all";
        as: "class";
      }
) => {
  switch (option.type) {
    case "department":
      return option.withPosition
        ? map.asDepartment.withPosition(option.department)
        : map.asDepartment.default(option.department);
    case "class":
      return map.asClass.default(option.gradeid, option.classid);
    case "all":
      switch (option.as) {
        case "class":
          return map.asAll.asClass();
        case "department":
          return option.withPosition
            ? map.asAll.asDepartmentWithPosition()
            : map.asAll.asDepartment();
        default:
          throw "Can not resolve the list method.";
      }
    default:
      throw "Can not resolve the list type.";
  }
};
