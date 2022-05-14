/**
 * /* eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

import adminreset from "./modules/admin";
import memberreset from "./modules/member";
import classreset from "./modules/class";
import { Ref } from "vue";

export default (
  type: Ref<string | undefined> | undefined,
  config: any,
  newpwd: {
    oldpwd: string;
    newpwd1: string;
    newpwd2: string;
  },
  t: any,
  router: any
) => {
  if (type?.value == "class") {
    classreset(config.gradeid, config.classid, newpwd, t, router);
  } else if (type?.value == "member") {
    memberreset(config.number, newpwd, t, router);
  } else if (type?.value == "admin") {
    adminreset(newpwd, t, router);
  }
};
