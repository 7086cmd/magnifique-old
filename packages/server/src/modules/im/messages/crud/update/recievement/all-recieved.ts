/** @format */

import { createSdbdataSaver } from "packages/server/src/modules/utils";
import { createSingleRoomItemGetter } from "../../../../rooms/crud";
import createPath from "../../../../utils/create-path";

export const createMessageAllReadedAction = (
  roomId: string,
  account: string
) => {
  const roomInfo = createSingleRoomItemGetter(roomId);
  // roomInfo.details[messageId].status[account] = true
  const entries = Object.entries(roomInfo.details);
  entries.forEach(([index, value]) => {
    if (value.content.length < 80 && value.type === "text") {
      roomInfo.details[index].status[account] = true;
    }
  });
  createSdbdataSaver(createPath(roomId), roomInfo);
  return {
    status: "ok",
  };
};
