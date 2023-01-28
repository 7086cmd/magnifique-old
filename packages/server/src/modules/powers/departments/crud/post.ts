/** @format */

/**
 * @path /api/admin/departments
 * @method POST
 * @description Create a new department
 * @auth true
 * @authType admin
 */

import { stringifyDepartments, parseDepartments } from "../parse";

export default function postDepartments(
  department: departmentItem & { id: string }
) {
  const departments = parseDepartments();
  departments.push(department);
  stringifyDepartments(departments);
  return {
    status: "ok",
  };
}
