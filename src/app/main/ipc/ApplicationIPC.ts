import { BrowserWindow } from "electron";
import type { ApplicationState } from "../state/ApplicationState";

export default class ApplicationIPC {
    constructor(
        private readonly window: BrowserWindow
    ) {}

    sendState(
        state: ApplicationState
    ): void {
        this.window.webContents.send(
            "application-state",
            state
        );
    }

}