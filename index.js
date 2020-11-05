// Import
const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const fs = require("fs");

// Main window
let mainWindow;

// Development
let isDev = () => {
    return process.argv.includes("--dev");
};

// Auto update status
const sendStatusToWindow = (args) => {
    log.info(args);
    if (mainWindow) {
        mainWindow.webContents.send("update_status", args);
    }
};

// Log dev mode
if (isDev()) {
    log.info("Running in development mode");
}

// Create window when ready
app.on("ready", () => {
    log.info("Ready, starting app");
    mainWindow = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        titleBarStyle: "hiddenInset",
    });
    mainWindow.setMenu(null);
    mainWindow.loadFile("index.html");
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    mainWindow.once("ready-to-show", () => {
        if (isDev()) {
            log.info("Opening dev tools");
            mainWindow.webContents.openDevTools({ mode: "detach" });
            setTimeout(() => {
                sendStatusToWindow({ text: "Update not available.", code: 2 });
            }, 1000);
        } else {
            log.info("In production, checking for updates");
            autoUpdater.autoInstallOnAppQuit = false;
            autoUpdater.checkForUpdatesAndNotify();
        }
    });
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

// Auto updates
autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow({ text: "Checking for update...", code: 0 });
});
autoUpdater.on("update-available", () => {
    sendStatusToWindow({ text: "Update available.", code: 1 });
});
autoUpdater.on("update-not-available", () => {
    sendStatusToWindow({ text: "Update not available.", code: 2 });
});
autoUpdater.on("error", (err) => {
    sendStatusToWindow({ text: `Error in auto-updater: ${err.toString()}`, code: -1 });
});
autoUpdater.on("download-progress", (progressObj) => {
    sendStatusToWindow({ code: 3, total: progressObj.total, current: progressObj.transferred + 1, percent: progressObj.percent });
});

autoUpdater.on("update-downloaded", () => {
    sendStatusToWindow({ code: 4 });

    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 5000);
});
