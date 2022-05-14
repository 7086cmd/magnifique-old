/** @format */

import { parse } from "json5";
import {
  createObjectToArrayTransformer,
  createClassDataReader,
} from "../../../../utils";

export default (gradeid: number, classid: number) => {
  const docsClass = createObjectToArrayTransformer(
    "id",
    parse(createClassDataReader("post", gradeid, classid)).details
  ) as PostList[];
  return {
    status: "ok",
    details: docsClass,
  };
};
