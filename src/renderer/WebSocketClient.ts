
import type { VisualAudio } from "../audio/visual/models/VisualAudio.mjs";
import type { SpotifyPlayback } from "../integrations/models/SpotifyTrack";

type ServerMessage =
    | {
        type: "audio";
        data: VisualAudio;
    }
    | {
        type: "playback";
        data: SpotifyPlayback | null;
    };

export default class WebSocketClient {
    private socket: WebSocket;

    private audioCallback:
        ((data: VisualAudio) => void) | null = null;

    private playbackCallback:
        ((playback: SpotifyPlayback | null) => void) | null = null;

    constructor() {
        this.socket = new WebSocket("ws://localhost:3000");


    this.socket.onmessage = (event: MessageEvent<string>) => {

        try {
            const message = JSON.parse(event.data) as ServerMessage | VisualAudio;


                if ("type" in message) {
                    switch (message.type) {
                        case "audio":
                            this.audioCallback?.(message.data);
                            break;

                        case "playback":
                            this.playbackCallback?.(message.data);
                            break;
                    }

                    return;
                }

                // Backwards compatibility with raw VisualAudio messages.
                this.audioCallback?.(message);
            } catch (error) {
                console.error(
                    "[WebSocketClient] Failed to parse message:",
                    error
                );
            }
        };

        this.socket.onopen = () => {
            console.info("[WebSocketClient] Connected");
        };

        this.socket.onerror = (error) => {
            console.error("[WebSocketClient] Connection error:", error);
        };

        this.socket.onclose = () => {
            console.warn("[WebSocketClient] Disconnected");
        };
    }

    onData(callback: (data: VisualAudio) => void): void {
        this.audioCallback = callback;
    }

    onPlayback(
        callback: (
            playback: SpotifyPlayback | null
        ) => void
    ): void {
        this.playbackCallback = callback;
    }

    close(): void {
        this.socket.close();
    }
}
