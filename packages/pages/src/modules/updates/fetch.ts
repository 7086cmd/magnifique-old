/** @format */

import baseurl from "../baseurl";

export const getUpd = async () => {
  const url = baseurl.startsWith("/api")
    ? "/update"
    : new URL(baseurl).origin + "/update";
  const resp = await fetch(url);
  const txt = await resp.json();
  return txt as {
    content: string;
    version: string;
  };
};
