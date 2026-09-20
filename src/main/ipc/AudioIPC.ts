import { BrowserWindow } from "electron";
import { AnalyzedAudio } from "../../audio/models/AnalyzedAudio";

export default class AudioIPC {
    constructor(private readonly window: BrowserWindow) {}

    //send audio Data to the Frontend to be visualized
    sendAudioData(data: AnalyzedAudio): void {
        this.window.webContents.send("audio-data", data);
    }
}