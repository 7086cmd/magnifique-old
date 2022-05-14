/** @format */

import { rmSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { createPersonNumberAnalyzor } from "../../../../utils";
import dayjs from "dayjs";
import { v4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (numb: number, handle: any) => {
  try {
    const ana = createPersonNumberAnalyzor(numb);
    const temppath = resolve(
      tmpdir(),
      `../magnifique/${ana.gradeid}/${ana.classid}/post.sdbdata`
    );
    if (!existsSync(temppath)) {
      return {
        status: "error",
        reason: "not-exists",
      };
    }
    let id = v4();
    const folder = resolve(
      tmpdir(),
      `../magnifique/${ana.gradeid}/${ana.classid}/posts`
    );
    if (!existsSync(folder)) {
      mkdirSync(folder);
    }
    while (existsSync(resolve(folder, id + ".docx"))) {
      id = v4();
    }
    copyFileSync(resolve(handle.path), resolve(folder, id + ".docx"));
    rmSync(handle.path);
    return {
      status: "ok",
      details: {
        person: numb,
        uploadtime: dayjs().toJSON(),
        path: resolve(folder, handle.filename),
        id,
      },
    };
  } catch (e) {
    return {
      status: "error",
      reason: "type-error",
      text: new Error(<string>e).message,
    };
  }
};
