import SpotifyManager from "./spotify/SpotifyManager";
import type { IntegrationEvent } from "./events/IntegrationEvent";
import type { ApplicationEvent } from "../app/main/events/ApplicationEvent";

//Decide how the external Events affect the Application
export default class IntegrationManager {

    private readonly listeners:
    Set<
        (event: ApplicationEvent) => void
    > = new Set();

    private unsubscribeSpotify:
        (() => void) | null = null;

    constructor(
        private readonly spotify: SpotifyManager
    ) {}

    //start the spotify lifecycle and subscribe to Event listeners
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

    //stop the spotify lifecycle and unsubscribe from event listeners
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
        const applicationEvent =
            this.toApplicationEvent(event);

        for (const listener of this.listeners) {
            listener(applicationEvent);
        }
    }

    //translate the IntegrationEvent to an ApplicationEvent
    private toApplicationEvent(
        event: IntegrationEvent
    ): ApplicationEvent {
        switch (event.type) {
            case "spotify.playback":
                return {
                    type: "spotify.playback",
                    playback: event.playback
                };

            //establish a default fallback
            default:
                throw new Error(
                    `Unhandled integration event: ${event.type}`
                );
        }
    }



    onEvent(
        callback: (
            event: ApplicationEvent
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