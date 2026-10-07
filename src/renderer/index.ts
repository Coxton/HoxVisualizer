import Renderer from "./Renderer";
import WebSocketClient from "./WebSocketClient";

const params =
    new URLSearchParams(
        window.location.search
    );

const useWebSocket =
    params.get("source") === "websocket";

let renderer: Renderer;

if (useWebSocket) {

    const webSocketClient =
        new WebSocketClient();

    renderer =
        new Renderer(
            webSocketClient.onData.bind(
                webSocketClient
            )
        );

} else {

    renderer =
        new Renderer(
            window.audio.onData
        );
}

renderer.start();