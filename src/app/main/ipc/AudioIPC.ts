import { BrowserWindow } from "electron";
import type { VisualAudio } from "../../../audio/visual/models/VisualAudio.mjs";

export default class AudioIPC {
    constructor(private readonly window: BrowserWindow) {}

    //send audio Data to the Frontend to be visualized
    sendAudioData(data: VisualAudio): void {
        this.window.webContents.send("audio-data", data);

    }
}