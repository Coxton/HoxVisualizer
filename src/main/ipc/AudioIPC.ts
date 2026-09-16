import { BrowserWindow } from "electron";
import { AnalyzedAudio } from "../../audio/models/AnalyzedAudio";

export default class AudioIPC {
    constructor(private readonly window: BrowserWindow) {}

    sendAudioData(data: AnalyzedAudio): void {
        this.window.webContents.send("audio-data", data);
    }
}