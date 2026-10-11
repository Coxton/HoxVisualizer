
import FrontendRenderer from "./FrontendRenderer";
import WebSocketClient from "./WebSocketClient";
import ApplicationStateClient from "./ApplicationStateClient";
import nowPlayingLayout from "./layouts/NowPlaying.html?raw";

const params = new URLSearchParams(window.location.search);
const useWebSocket = params.get("source") === "websocket";

let renderer: FrontendRenderer;
let applicationState: ApplicationStateClient | null = null;
let webSocketClient: WebSocketClient | null = null;

if (useWebSocket) {
    webSocketClient = new WebSocketClient();

    renderer = new FrontendRenderer(
        webSocketClient.onData.bind(webSocketClient)
    );

    webSocketClient.onPlayback((playback) => {
        renderer.updatePlayback(playback);
    });
} else {
    applicationState = new ApplicationStateClient();

    renderer = new FrontendRenderer(
        window.audio.onData,
        applicationState.onChange.bind(applicationState)
    );
}

renderer.start();
applicationState?.start();

renderer.initializeHUD(nowPlayingLayout).catch((error) => {
    console.error("Failed to initialize Now Playing HUD:", error);
});
