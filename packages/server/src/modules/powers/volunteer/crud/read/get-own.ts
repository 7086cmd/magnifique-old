/** @format */

import { getSingleMemberAsRaw } from "../../../member";
import { createObjectToArrayTransformer } from "../../../../utils";
export default (memberNumber: number) => {
  const member_info = getSingleMemberAsRaw(memberNumber).details as member;
  const memberVolunteer = createObjectToArrayTransformer(
    "idInUserData",
    member_info.volunteer.details
  );
  return {
    status: "ok",
    details: memberVolunteer as VolunteerList[],
  };
};
