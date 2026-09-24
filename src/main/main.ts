import { app, BrowserWindow, Menu } from "electron/main";
import path from "node:path";

import AudioManager from "../audio/AudioManager";
import AudioAnalyzer from "../audio/analysis/AudioAnalyzer";
import AudioIPC from "./ipc/AudioIPC";


// create Electron Window and load preload file
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"),
        }
    });

    win.loadFile(path.join(__dirname, "../renderer/index.html"));

    return win;
};


// start the main Process
app.whenReady().then(() => {

    // Remove the Electron application menu
    //Menu.setApplicationMenu(null);

    const win = createWindow();

    const audioManager = new AudioManager();
    const audioAnalyzer = new AudioAnalyzer();
    const audioIPC = new AudioIPC(win);

    // start processes once the window has finished loading
    win.webContents.once("did-finish-load", () => {

        // start the SystemAudio Pipeline
        audioManager.startSystemAudio((frame) => {

            const analyzed = audioAnalyzer.analyze(frame);

            // sending analyzed Audio to the renderer
            audioIPC.sendAudioData(analyzed);
        });
    });
});