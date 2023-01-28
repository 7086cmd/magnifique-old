/** @format */

/**
 * @path /api/admin/departments
 * @method DELETE
 * @description Delete a department
 * @auth true
 * @authType admin
 */

import { stringifyDepartments, parseDepartments } from "../parse";

export default function deleteDepartments(id: string) {
  const departments = parseDepartments();
  const index = departments.findIndex((d) => d.id === id);
  departments.splice(index, 1);
  stringifyDepartments(departments);
  return {
    status: "ok",
  };
}
