import SpotifyManager from "./spotify/SpotifyManager";
import type { IntegrationEvent } from "./events/IntegrationEvent";

export default class IntegrationManager {

    private readonly listeners:
    Set<
        (event: IntegrationEvent) => void
    > = new Set();

    private unsubscribeSpotify:
        (() => void) | null = null;

    constructor(
        private readonly spotify: SpotifyManager
    ) {}

    start(): void {
        if (this.unsubscribeSpotify) {
            return;
        }

        this.unsubscribeSpotify =
            this.spotify.onPlaybackChange(
                (playback) => {
                    this.emit({
                        type: "spotify.playback",
                        playback
                    });
                }
            );

        this.spotify.start();
    }

    stop(): void {
        this.spotify.stop();

        if (this.unsubscribeSpotify) {
            this.unsubscribeSpotify();
            this.unsubscribeSpotify = null;
        }
    }


    private emit(
        event: IntegrationEvent
    ): void {
        for (const listener of this.listeners) {
            listener(event);
        }
    }



    onEvent(
        callback: (
            event: IntegrationEvent
        ) => void
    ): () => void {
        this.listeners.add(
            callback
        );

        return () => {
            this.listeners.delete(
                callback
            );
        };
    }
}