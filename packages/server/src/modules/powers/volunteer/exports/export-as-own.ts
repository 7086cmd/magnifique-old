/** @format */

import exportOverview from "./utils/export-overview";
import createSingleItem from "./utils/create-single-item";
export default (
  memberNumber: number,
  config?: {
    start: string;
    end: string;
  }
) => {
  return exportOverview() + createSingleItem(memberNumber, config);
};
