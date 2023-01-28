/** @format */

import { resolve } from "path";
import { createSdbdataParser, createSdbdataSaver } from "../../../utils";
import { tmpdir } from "os";
import { existsSync } from "fs";

if (!existsSync(resolve(tmpdir(), "..", "magnifique", "departments.sdbdata"))) {
  stringifyDepartments([]);
}

export function parseDepartments() {
  const departments = createSdbdataParser(
    resolve(tmpdir(), "..", "magnifique", "departments.sdbdata")
  ) as department;
  const depList: departmentList = [];
  // warning: department["departments"] is a Record<string, ...>
  // so we need to iterate over the keys
  for (const [id, dep] of Object.entries(departments.departments)) {
    depList.push({
      ...dep,
      id,
    });
  }
  return depList;
}

export function stringifyDepartments(departments: departmentList) {
  // The data is stored with type `department` while it is a { departments: Record<string, departmentItem> }.
  // So we need to convert it to the correct type before saving it.
  const departmentsData: department = {
    departments: {},
  };
  for (const dep of departments) {
    departmentsData.departments[dep.id] = {
      ...dep,
    };
  }
  // return departmentsData;
  // Save the data
  createSdbdataSaver(
    resolve(tmpdir(), "..", "magnifique", "departments.sdbdata"),
    departmentsData
  );
}
