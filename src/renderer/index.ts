import FrontendRenderer from "./FrontendRenderer";
import WebSocketClient from "./WebSocketClient";

const params =
    new URLSearchParams(
        window.location.search
    );

const useWebSocket =
    params.get("source") === "websocket";

let renderer: FrontendRenderer;

if (useWebSocket) {

    const webSocketClient =
        new WebSocketClient();

    renderer =
        new FrontendRenderer(
            webSocketClient.onData.bind(
                webSocketClient
            )
        );

} else {

    renderer =
        new FrontendRenderer(
            window.audio.onData
        );
}

renderer.start();