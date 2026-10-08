import { app, BrowserWindow, Menu } from "electron/main";
import path from "node:path";
import dotenv from "dotenv";

import Server from "../../server/Server";

import AudioManager from "../../audio/AudioManager";
import AudioAnalyzer from "../../audio/analysis/AudioAnalyzer";
import AudioIPC from "./ipc/AudioIPC";

import VisualResponseLimiter from "../../audio/visual/VisualResponseLimiter.mjs";

import SpotifyAuth from "../../integrations/spotify/SpotifyAuth";
import SpotifyClient
    from "../../integrations/spotify/SpotifyClient";

import SpotifyManager
    from "../../integrations/spotify/SpotifyManager";

import IntegrationManager from "../../integrations/IntegrationManager";


    // create Electron Window and load preload file
    const createWindow = () : BrowserWindow => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,

            webPreferences: {
                preload: path.join(__dirname, "../preload/preload.js"),
            }
        });

        win.loadFile(path.join(__dirname, "../../renderer/index.html"));

        return win;
    };

    const spotifyEnvPath =
        path.join(
            __dirname,
            "../../../src/config/credentials/spotify.env"
        );

    dotenv.config({
        path: spotifyEnvPath
    });



// start the main Process
app.whenReady().then( async() => {

    // Remove the Electron application menu
    //Menu.setApplicationMenu(null);

    //setup the Spotify lifecycle
    const spotifyAuth =
        new SpotifyAuth(
            "http://127.0.0.1:3000/spotify/callback",
            spotifyEnvPath
        );

    const spotifyClient =
    new SpotifyClient(
        spotifyAuth
    );

    const spotifyManager =
        new SpotifyManager(
            spotifyClient
        );
     
    const integrationManager =
        new IntegrationManager(
            spotifyManager
        );

    


    integrationManager.start();



    const server =
        new Server(
            spotifyAuth
        );

    server.start();

    const win = createWindow();

        const audioManager = new AudioManager();
        const audioAnalyzer = new AudioAnalyzer();
        const audioIPC = new AudioIPC(win);

        const visualResponseLimiter =
            new VisualResponseLimiter();




        // start processes once the window has finished loading
        win.webContents.once("did-finish-load", async () => {

            // start the SystemAudio Pipeline
            audioManager.startDefaultAudio((frame) => {
                const analyzed = audioAnalyzer.analyze(frame);

                //convert analysation Audio to visual Audio
                const visualAudio =
                    visualResponseLimiter.process(analyzed);

                audioIPC.sendAudioData(visualAudio);

                server.broadcast(visualAudio);
            });

        });
    });