const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
import AudioCapture from "../audio/capture/AudioCapture";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"),
        }
    });

    win.loadFile("src/renderer/index.html");
};

app.whenReady().then(() => {

    createWindow();

    const audioCapture = new AudioCapture();

    audioCapture.startSystemAudio((data: Buffer) => {
        console.log({
            bytes: data.length,
            firstBytes: data.subarray(0, 16)
        });
    });
});