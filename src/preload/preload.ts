import { contextBridge, ipcRenderer } from "electron";


//expose audio to the Frontend
contextBridge.exposeInMainWorld("audio", {
    //listen for analyzed Audio to be sent
    onData(callback: (data: unknown) => void): void {

        ipcRenderer.on("audio-data", (_event, data) => {

            callback(data);
        });
    }
});