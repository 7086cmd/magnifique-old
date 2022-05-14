/** @format */

import getDepartmentData from "./get-department-data";

export default (departmentid: string) => {
  const data = getDepartmentData();
  return data.details.departments[departmentid].duty;
};
