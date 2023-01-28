/** @format */

/**
 * @path /api/admin/departments
 * @method PUT
 * @description Update a department
 * @auth true
 * @authType admin
 */

import { stringifyDepartments, parseDepartments } from "../parse";

export default function putDepartments(
  department: departmentItem & { id: string }
) {
  const departments = parseDepartments();
  const index = departments.findIndex((d) => d.id === department.id);
  departments[index] = department;
  stringifyDepartments(departments);
  return {
    status: "ok",
  };
}
