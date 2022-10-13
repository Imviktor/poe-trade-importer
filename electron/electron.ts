'use strict'

const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path');
const os = require("os")

const isDev = process.env.IS_DEV == "true" ? true : false;

const createWindow = () => {
    const win = new BrowserWindow({
        backgroundColor: 'lightgray',
        title: "Poe Importer > Trader",
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.ts'),
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:5173');// Open the DevTools.
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../index.html'));
    }
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools();
    }

    // Enable keyboard shortcuts for Developer Tools on various platforms.
    let platform = os.platform()
    if (platform === 'darwin') {
        globalShortcut.register('Command+Option+I', () => {
            win.webContents.openDevTools()
        })
    } else if (platform === 'linux' || platform === 'win32') {
        globalShortcut.register('Control+Shift+I', () => {
            win.webContents.openDevTools()
        })
    }

    win.once('ready-to-show', () => {
        win.setMenu(null)
        win.maximize()
        win.show()
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
