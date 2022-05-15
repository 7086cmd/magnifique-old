/** @format */
// @ts-check

import { readFileSync } from "fs";

/**
 * @function md_transfer
 * @description Transfer a .md file into string
 * @returns {import("esbuild").Plugin}
 */
export function md_transfer() {
  return {
    name: "md-transfer",
    /**
     * @function setup
     * @description function setup
     * @param {import("esbuild").PluginBuild} build
     * @returns {void}
     */
    setup(build) {
      build.onLoad({ filter: /\.md$/ }, (args) => {
        // eslint-disable-next-line no-console
        console.log("Fetched Markdown File: ", args.path);
        const readed = readFileSync(args.path)
          .toString()
          .replaceAll("`", "\\`");
        const content = `export default \`${readed}\``;
        return {
          contents: content,
          loader: "ts",
        };
      });
    },
  };
}
