/** @format */

import getClass from "./get-class";
import { createYearTransformer } from "../../../../utils";

export default () => {
  let base = [];
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 15; j++) {
      base.push(...getClass(createYearTransformer(i), j).details);
    }
  }
  return {
    status: "ok",
    details: base as member[],
  };
};
