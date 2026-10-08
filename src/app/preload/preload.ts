import { contextBridge, ipcRenderer } from "electron";
import type { ApplicationState } from "../main/state/ApplicationState";

//expose audio to the Frontend
contextBridge.exposeInMainWorld("audio", {
    //listen for analyzed Audio to be sent
    onData(callback: (data: unknown) => void): void {

        ipcRenderer.on("audio-data", (_event, data) => {

             callback(data);
             
        });
    }
});


//expose application state to the Frontend
contextBridge.exposeInMainWorld("application", {

    onStateChange(
        callback: (state: ApplicationState) => void
    ): () => void {

        const listener = (
            _event: Electron.IpcRendererEvent,
            state: ApplicationState
        ) => {
            callback(state);
        };

        ipcRenderer.on(
            "application-state",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
                "application-state",
                listener
            );
        };
    }
});