import { BrowserWindow } from "electron";
import { AnalyzedAudio } from "../../audio/models/AnalyzedAudio";

export default class AudioIPC {
    constructor(private readonly window: BrowserWindow) {}

    sendAudioData(data: AnalyzedAudio): void {
        console.log("Main sending audio-data");
        this.window.webContents.send("audio-data", data);
    }
}