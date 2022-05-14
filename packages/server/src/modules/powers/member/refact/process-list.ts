/** @format */

import process from "./process";

export default (details: { status: string; details: member[] }) => {
  if (details.status == "error") {
    return details;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let base: member_processed[] = [];
    for (let i = 0; i in details.details; i++) {
      base.push(process(details.details[i]));
    }
    return {
      status: "ok",
      details: base,
    } as status;
  }
};
