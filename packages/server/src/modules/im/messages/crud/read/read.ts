/** @format */

import { createObjectToArrayTransformer } from "packages/server/src/modules/utils";
import { recievementActions } from "..";
import { createSingleRoomItemGetter } from "../../../rooms/crud";

export const createMessageReader = (roomId: string, requester: string) => {
  const messages = createSingleRoomItemGetter(roomId);
  if (!messages.config.users.includes(requester)) {
    return {
      status: "error",
      reason: "no-auth",
    };
  }
  recievementActions.all(roomId, requester);
  return {
    status: "ok",
    details: createObjectToArrayTransformer(
      "id",
      messages.details
    ) as MessageItem[],
  };
};
