/** @format */

import { tmpdir } from "os";
import { resolve } from "path";
import { createSdbdataParser } from "../utils";

export default () => {
  return {
    status: "ok",
    details: createSdbdataParser(
      resolve(tmpdir(), "..", "magnifique", "departments.sdbdata")
    ) as department,
  };
};
