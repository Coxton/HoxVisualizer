import { contextBridge, ipcRenderer } from "electron";

console.log("Preload loaded");

contextBridge.exposeInMainWorld("audio", {
    onData(callback: (data: unknown) => void): void {
        //console.log("Renderer registered audio listener");

        ipcRenderer.on("audio-data", (_event, data) => {
            //console.log("Preload received actual audio data");
            callback(data);
        });
    }
});