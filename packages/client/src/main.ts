/** @format */

import { AxiosRequestConfig } from "axios";
/** @format */
import {
  app,
  BrowserWindow,
  screen,
  protocol,
  ipcMain,
  Tray,
  Menu,
} from "electron";
import { join } from "path";
import axios from "axios";
import { defineConfig, readConfig } from "./modules/config/generate";

defineConfig();

function calc_screen_size(): { width: number; height: number } {
  return {
    width: Math.floor((screen.getPrimaryDisplay().workAreaSize.width * 2) / 3),
    height: Math.floor(
      (screen.getPrimaryDisplay().workAreaSize.height * 2) / 3
    ),
  };
}

let tray: Tray | undefined = undefined;

protocol.registerSchemesAsPrivileged([
  { scheme: "magnifique", privileges: { bypassCSP: true, stream: true } },
]);

app.whenReady().then(() => {
  tray = new Tray(
    process.env.NODE_ENV === "development"
      ? join(__dirname, "../../../icons/client.ico")
      : join(__dirname, "../icons/client.ico")
  );
  let mainWindow = new BrowserWindow({
    ...calc_screen_size(),
    show: false,
    frame: false,
    webPreferences: {
      preload: join(
        __dirname,
        process.env.NODE_ENV == "development"
          ? "./preload.js"
          : "./client.preload.min.js"
      ),
    },
  });
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "打开主界面",
        click: () => mainWindow.show(),
      },
      {
        type: "separator",
      },
      {
        label: "退出",
        click: () => {
          mainWindow.destroy();
          app.quit();
        },
      },
    ])
  );
  tray.on("double-click", () => mainWindow.show());
  mainWindow.loadURL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : join("magnifique://", __dirname, "../pages/index.html")
  );
  mainWindow.on("close", (ev) => {
    mainWindow.hide();
    ev.preventDefault();
  });
  process.env.NODE_ENV === "development" ??
    mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  ipcMain.on("close-main-window", () => mainWindow.close());
  ipcMain.on("minimize-main-window", () => mainWindow.minimize());
  ipcMain.on("maximize-main-window", () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );
  ipcMain.on("request-start", (_evt, data: AxiosRequestConfig) => {
    let uri = new URL(data.url as string);
    uri.host = readConfig().server.host;
    uri.port = readConfig().server.port;
    axios(data).then((resp) => {
      mainWindow.webContents.send("request-end", resp.data);
    });
  });
});
