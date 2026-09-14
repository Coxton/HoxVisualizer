const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.ts'),
            sandbox: false,
        }
    })

    win.loadFile('src/renderer/index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
})