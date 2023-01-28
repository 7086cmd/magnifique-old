/** @format */

/**
 * @path /api/admin/departments
 * @method GET
 * @description Get all departments
 * @auth true
 * @authType admin
 */

import { parseDepartments } from "../parse";

export default function getDepartments() {
  return parseDepartments();
}
