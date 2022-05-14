/** @format */

// volunteer is only for members.
import {
  createMemberIndex,
  createSdbdataParser,
  createSdbdataSaver,
} from "../../../../utils";
import { v4 as createId } from "uuid";

export default (memberNumber: number, volunteerData: volunteer) => {
  const path = createMemberIndex(memberNumber);
  const info = createSdbdataParser(path) as member;
  let id = createId();
  while (info.volunteer.details[id] !== undefined) {
    id = createId();
  }
  info.volunteer.details[id] = volunteerData;
  createSdbdataSaver(path, info);
  return {
    status: "ok",
  };
};
