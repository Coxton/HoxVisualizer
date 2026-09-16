import { app, BrowserWindow } from "electron/main";
import path from "node:path";

import AudioManager from "../audio/AudioManager";
import AudioAnalyzer from "../audio/analysis/AudioAnalyzer";
import AudioIPC from "./ipc/AudioIPC";

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

app.whenReady().then(() => {
    const win = createWindow();

    const audioManager = new AudioManager();
    const audioAnalyzer = new AudioAnalyzer();
    const audioIPC = new AudioIPC(win);

    win.webContents.once("did-finish-load", () => {
        console.log("Renderer finished loading");

        audioManager.start((frame) => {
            //console.log("Main received audio frame");

            const analyzed = audioAnalyzer.analyze(frame);

            audioIPC.sendAudioData(analyzed);
        });
    });
});