import { VisualAudio } from "../audio/visual/models/VisualAudio.mjs";

export default class WebSocketClient {

    private socket: WebSocket;

    private callback:
        ((data: VisualAudio) => void) | null = null;

    constructor() {

        this.socket =
            new WebSocket(
                "ws://localhost:3000"
            );

        this.socket.onmessage = (event) => {

            const data: VisualAudio =
                JSON.parse(event.data);

                

            this.callback?.(data);
        };
    }

    onData(
        callback: (data: VisualAudio) => void
    ): void {

        this.callback = callback;
    }
}