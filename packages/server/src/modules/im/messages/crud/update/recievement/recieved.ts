/** @format */

import { createSdbdataSaver } from "packages/server/src/modules/utils";
import { createSingleRoomItemGetter } from "../../../../rooms/crud";
import createPath from "../../../../utils/create-path";

export const createMessageReadedAction = (
  roomId: string,
  messageId: string,
  account: string
) => {
  const roomInfo = createSingleRoomItemGetter(roomId);
  roomInfo.details[messageId].status[account] = true;
  createSdbdataSaver(createPath(roomId), roomInfo);
  return {
    status: "ok",
  };
};
