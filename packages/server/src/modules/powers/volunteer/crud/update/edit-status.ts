/** @format */

// volunteer is only for members.
import {
  createMemberIndex,
  createSdbdataParser,
  createSdbdataSaver,
} from "../../../../utils";

export default (
  memberNumber: number,
  id: string,
  status: volunteer["status"]
) => {
  const path = createMemberIndex(memberNumber);
  const info = createSdbdataParser(path) as member;
  info.volunteer.details[id].status = status;
  createSdbdataSaver(path, info);
};
