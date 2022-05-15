/**
 * @format
 */

/** @format */

import chalk from "chalk";
/**
 * @function url_plugin
 * @returns {import("esbuild").Plugin}
 */

export function url_plugin() {
  return {
    name: "url-plugin",
    setup(build) {
      build.onLoad({ filter: /^https?:\/\// }, async (args) => {
        // eslint-disable-next-line no-console
        console.log(chalk.green("Fetching online module: " + args.path));
        const resp = await fetch(args);
        if (resp.status >= 400) {
          // eslint-disable-next-line no-console
          console.error(
            chalk.red("Fetch " + args.path + " Failed: " + resp.text())
          );
          throw resp.text();
        } else {
          return {
            contents: resp.text(),
          };
        }
      });
    },
  };
}
