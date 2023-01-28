/** @format */

/**
 * @path /api/admin/departments
 * @support get, post, put, delete
 * @auth true
 * @authType admin
 * @description CRUD for departments
 */

import getDepartments from "./get";
import postDepartments from "./post";
import putDepartments from "./put";
import deleteDepartments from "./delete";

export {
  getDepartments as get,
  postDepartments as post,
  putDepartments as put,
  deleteDepartments as delete,
};
