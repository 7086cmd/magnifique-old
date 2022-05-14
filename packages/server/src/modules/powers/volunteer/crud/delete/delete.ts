/** @format */

// volunteer is only for members.
import {
  createMemberIndex,
  createSdbdataParser,
  createSdbdataSaver,
} from "../../../../utils";

export default (memberNumber: number, id: string) => {
  const path = createMemberIndex(memberNumber);
  const info = createSdbdataParser(path) as member;
  delete info.volunteer.details[id];
  createSdbdataSaver(path, info);
};
