/** @format */

import { existsSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { file } from "@magnifique/sdbdata";
import { config } from "./config";

const standardConfig = (): config => ({
  version: "2.0.1",
  server: {
    host: "",
    port: "80",
  },
  user: {
    dark: false,
    mute: false,
    login: {
      direct: false,
    },
    panels: ["class", "member", "admin"],
  },
});

const dir = resolve(tmpdir(), "..", "magnifique");

export function defineConfig() {
  const dir = resolve(tmpdir(), "..", "magnifique");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  if (!existsSync(resolve(dir, "client.config.sdbdata"))) {
    file.save(resolve(dir, "client.config.sdbdata"), standardConfig());
  }
}

export function readConfig() {
  const dir = resolve(tmpdir(), "..", "magnifique");
  if (!existsSync(dir)) defineConfig();
  if (!existsSync(resolve(dir, "client.config.sdbdata"))) defineConfig();
  return file.open(resolve(dir, "client.config.sdbdata")) as config;
}

export function useNewServer(host: string, port: string) {
  const config = readConfig();
  config.server.host = host;
  config.server.port = port;
  file.save(resolve(dir, "client.config.sdbdata"), config);
}
