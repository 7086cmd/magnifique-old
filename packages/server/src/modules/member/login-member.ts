/** @format */

import { tmpdir } from "os";
import { existsSync } from "fs";
import { resolve } from "path";
import { sha512 } from "js-sha512";
import { createPersonNumberAnalyzor, createSdbdataParser } from "../utils";

export default (person: number, password: string) => {
  if (typeof person !== "number") {
    person = Number(person);
  }
  const ana = createPersonNumberAnalyzor(person);
  let temppath = resolve(
    tmpdir(),
    `../magnifique/${ana.gradeid}/${ana.classid}/members/`
  );
  if (existsSync(temppath)) {
    try {
      temppath = resolve(temppath, `./${person}.sdbdata`);
      const opwd = (createSdbdataParser(temppath) as member).password;
      const npwd = sha512(password);
      if (opwd == npwd) {
        return {
          status: "ok",
        };
      } else {
        return {
          status: "error",
          reason: "password-wrong",
        };
      }
    } catch (e) {
      return {
        status: "error",
        reason: "type-error",
        text: new Error(<string>e).message,
      };
    }
  } else {
    return {
      status: "error",
      reason: "not-exists",
    };
  }
};
