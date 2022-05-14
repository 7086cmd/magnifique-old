/** @format */

import getSingleMemberAsRaw from "../crud/read/raw";
export default (
  memberNumber: string,
  dutyWhichIsWaitingForCheck: "post" | "deduction" | "volunteer" | "radio"
) => {
  if (getSingleMemberAsRaw(parseInt(memberNumber)).status === "error") {
    throw "不存在的文件";
  } else {
    return (
      getSingleMemberAsRaw(parseInt(memberNumber)).details as unknown as member
    ).union.duty.includes(dutyWhichIsWaitingForCheck);
  }
};
