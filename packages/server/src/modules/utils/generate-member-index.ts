/** @format */

import { tmpdir } from "os";
import { resolve } from "path";
import analyzePerson from "./analyze-person";

export default (member: number) => {
  return resolve(
    tmpdir(),
    "..",
    "magnifique",
    String(analyzePerson(member).gradeid),
    String(analyzePerson(member).classid),
    "members",
    `${member}.sdbdata`
  );
};
