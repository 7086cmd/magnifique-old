/** @format */

import { contextBridge, ipcRenderer } from "electron";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { readConfig } from "./modules/config/generate";

contextBridge.exposeInMainWorld("magnifique", {
  closeServer() {
    ipcRenderer.send("close-main-window");
  },
  minServerWindow() {
    ipcRenderer.send("minimize-main-window");
  },
  maxServerWindow() {
    ipcRenderer.send("maximize-main-window");
  },
  isElectron: true,
  request(uri: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve) => {
      ipcRenderer.send("request-start", {
        url: uri,
        ...config,
      } as AxiosRequestConfig);
      ipcRenderer.on("request-end", (_evt, data: string) => {
        resolve(JSON.parse(data) as AxiosResponse["data"]);
      });
    });
  },
  config: readConfig(),
});
