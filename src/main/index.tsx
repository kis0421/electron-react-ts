import { app, BrowserWindow, dialog, Menu, Tray } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
const tray = null;
const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: any;

function createMainWindow() {
  const window = new BrowserWindow({ webPreferences: { nodeIntegration: true } });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  console.log(path.join(__dirname, "index.html"));
  console.log(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      }),
    );
  }

  window.on("closed", () => {
    // mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", (e: Event) => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    const choice = dialog.showMessageBox({
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "다팔자를 종료하시겠습니까?",
    });
    if (choice === 1) {
      e.preventDefault();
    } else {
      app.quit();
    }

  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
  // tray
  // tray = new Tray(`${__dirname}/static/shibe.png`);
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: "Item1", type: "separator" },
  //   {
  //     label: "Item2", click() {
  //       console.log("dd");
  //     },
  //   },
  //   { label: "Item3", type: "radio", checked: true },
  //   { label: "Item4", type: "radio" },
  // ]);
  // tray.setToolTip("이것은 나의 애플리케이션 입니다!");
  // tray.setContextMenu(contextMenu);
});
