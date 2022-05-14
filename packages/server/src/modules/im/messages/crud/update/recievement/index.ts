/** @format */

import { createMessageAllReadedAction } from "./all-recieved";
import { createMessageReadedAction } from "./recieved";

const recievementActions = {
  all: createMessageAllReadedAction,
  single: createMessageReadedAction,
};

export { recievementActions };
