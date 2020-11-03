const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.setMenu(null);
    mainWindow.loadFile("index.html");
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    mainWindow.once("ready-to-show", () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
    mainWindow.webContents.openDevTools({ mode: "detach" });
}

app.on("ready", () => {
    log.info("Ready, starting app");
    createWindow();
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
    log.info(text);
    if (mainWindow) {
        mainWindow.webContents.send("update_status", text);
    }
};

autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow({ text: "Checking for update...", code: 0 });
});
autoUpdater.on("update-available", (info) => {
    sendStatusToWindow({ text: "Update available.", code: 1 });
});
autoUpdater.on("update-not-available", (info) => {
    sendStatusToWindow({ text: "Update not available.", code: 2 });
});
autoUpdater.on("error", (err) => {
    sendStatusToWindow({ text: `Error in auto-updater: ${err.toString()}`, code: -1 });
});
autoUpdater.on("download-progress", (progressObj) => {
    sendStatusToWindow({ code: 3, total: progressObj.total, current: progressObj.transferred + 1, percent: progressObj.percent });
});

autoUpdater.on("update-downloaded", (info) => {
    sendStatusToWindow({ code: 4 });

    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 5000);
});
