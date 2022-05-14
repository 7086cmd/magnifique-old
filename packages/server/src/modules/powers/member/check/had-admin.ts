/** @format */

import getSingleMemberAsRaw from "../crud/read/raw";
export default (
  memberNumber: string | number,
  dutyWhichIsWaitingForCheck:
    | "post"
    | "deduction"
    | "volunteer"
    | "radio"
    | "member"
    | "member-volunteer"
    | "member-register"
) => {
  if (getSingleMemberAsRaw(Number(memberNumber)).status === "error") {
    throw "不存在的文件";
  } else {
    if (dutyWhichIsWaitingForCheck === "member") {
      return (
        (
          getSingleMemberAsRaw(Number(memberNumber))
            .details as unknown as member
        ).union.position === "minister"
      );
    } else if (dutyWhichIsWaitingForCheck === "member-volunteer") {
      const unionConf = (
        getSingleMemberAsRaw(Number(memberNumber)).details as unknown as member
      ).union;
      return (
        unionConf.position.includes("minister") ||
        unionConf.admin.includes("member-volunteer")
      );
    } else if (dutyWhichIsWaitingForCheck === "member-register") {
      const details = getSingleMemberAsRaw(Number(memberNumber))
        .details as unknown as member;
      return (
        details.union.position.includes("minister") ||
        details.union.position.includes("chairman")
      );
    } else {
      return getSingleMemberAsRaw(
        Number(memberNumber)
      ).details?.union.admin.includes(dutyWhichIsWaitingForCheck);
    }
  }
};
