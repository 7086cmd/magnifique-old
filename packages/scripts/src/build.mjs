/**
 * /* eslint-disable no-console
 *
 * @format
 */

import { build as buildFrontEnd } from "vite";
import { build as buildBackEnd } from "esbuild";
import { build as buildApp } from "electron-builder";
import { md_transfer } from "./modules/md.mjs";
import "./lint.mjs";
const main = async () => {
  await buildFrontEnd();
  await buildBackEnd({
    entryPoints: ["packages/server/src/main.ts"],
    outfile: "dist/server.min.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    minify: true,
    sourcemap: true,
    target: ["node16"],
    loader: {
      ".png": "file",
      ".ts": "ts",
    },
    logLevel: "info",
    chunkNames: "chunks/[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    color: true,
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    banner: {
      js: "/* Copyright© 2022 7086cmd */",
    },
    treeShaking: true,
    external: ["electron"],
    metafile: true,
    plugins: [md_transfer()],
  });
  await buildBackEnd({
    entryPoints: ["packages/server/src/preload.ts"],
    outfile: "dist/server.preload.min.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    minify: true,
    sourcemap: true,
    target: ["node16"],
    loader: {
      ".png": "file",
      ".ts": "ts",
    },
    logLevel: "info",
    chunkNames: "chunks/[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    color: true,
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    banner: {
      js: "/* Copyright© 2022 7086cmd */",
    },
    treeShaking: true,
    external: ["electron"],
    plugins: [md_transfer()],
  });
  await buildBackEnd({
    entryPoints: ["packages/client/src/main.js"],
    outfile: "dist/client.min.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    minify: true,
    sourcemap: true,
    target: ["node16"],
    loader: {
      ".png": "file",
      ".ts": "ts",
    },
    logLevel: "info",
    chunkNames: "chunks/[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    color: true,
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    banner: {
      js: "/* Copyright© 2022 7086cmd */",
    },
    treeShaking: true,
    external: ["electron"],
    plugins: [md_transfer()],
  });
  await buildBackEnd({
    entryPoints: ["packages/client/src/preload.ts"],
    outfile: "dist/client.preload.min.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    minify: true,
    sourcemap: true,
    target: ["node16"],
    loader: {
      ".png": "file",
      ".ts": "ts",
    },
    logLevel: "info",
    chunkNames: "chunks/[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    color: true,
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    banner: {
      js: "/* Copyright© 2022 7086cmd */",
    },
    treeShaking: true,
    external: ["electron"],
    plugins: [md_transfer()],
  });
  await buildApp({
    publish: "always",
    config: {
      files: [
        "./dist/docs/**/*",
        "./dist/pages/**/*",
        "./dist/docs/*",
        "./dist/pages/*",
        "./dist/server.min.js",
        "./dist/server.preload.min.js",
        "./icons/server.ico",
        "./ssl/*",
      ],
      extraMetadata: {
        main: "dist/server.min.js",
      },
      asar: true,
      extends: null,
      appId: "com.magnifique.server",
      copyright: "Copyright ©7086cmd 2021 GNU License",
      productName: "Magnifique Server",
      win: {
        icon: "./icons/server.ico",
        target: [
          {
            target: "nsis",
            arch: ["x64"],
          },
          {
            target: "zip",
            arch: ["x64"],
          },
        ],
        publish: [
          {
            provider: "github",
            owner: "7086cmd",
            repo: "magnifique",
          },
        ],
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        shortcutName: "Magnifique Server",
        menuCategory: "Magnifique",
      },
    },
  });
};
main();
