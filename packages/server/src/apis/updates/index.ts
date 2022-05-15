/** @format */

import { content } from "./parse";

export function request(version: string) {
  return {
    version,
    content: content()[version],
  };
}

export function latest() {
  const contents = Object.entries(content());
  return {
    version: contents[0][0],
    content: contents[0][1],
  };
}
