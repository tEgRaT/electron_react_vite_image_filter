"use strict";
const electron = require("electron");
const path = require("path");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
let mainWindow;
const handleFileOpen = async () => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
};
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/preload.js"),
      webSecurity: false
      // Set to false to keep this example simple,
      // but in a real app, should be set to true.
      // Refer to https://github.com/electron/electron/issues/23393#issuecomment-623694579 for example.
    }
  });
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => mainWindow = null);
};
electron.app.whenReady().then(() => {
  electron.ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
