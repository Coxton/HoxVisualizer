import SpotifyClient from "./SpotifyClient";
import type { SpotifyPlayback } from "../models/SpotifyTrack";

export default class SpotifyManager {

    private currentPlayback:
        SpotifyPlayback | null = null;

    private pollingInterval:
        NodeJS.Timeout | null = null;    

    private readonly listeners:
        Set<(playback: SpotifyPlayback) => void> =
            new Set();    

    private static readonly POLLING_INTERVAL_MS = 1000;        

    constructor(
        private readonly client: SpotifyClient
    ) {}
    
    //get the current song playing
    async getCurrentPlayback(): Promise<SpotifyPlayback> {
        const previousPlayback =
            this.currentPlayback;

        const playback =
            await this.client.getCurrentlyPlaying();

        this.currentPlayback =
            playback;

        if (
            this.hasPlaybackChanged(
                previousPlayback,
                playback
            )
        ) {
            for (const listener of this.listeners) {
                listener(playback);
            }
        }

        return playback;
    }

    get playback(): SpotifyPlayback | null {
        return this.currentPlayback;
    }

    //start the polling process
    start(): void {
        if (this.pollingInterval) {
            return;
        }

        this.pollingInterval =
            setInterval(
                () => {
                    this.getCurrentPlayback()
                        .catch((error) => {
                            console.error(
                                "Spotify polling failed:",
                                error
                            );
                        });
                },
                SpotifyManager.POLLING_INTERVAL_MS
            );
    }

    //stop the polling process
    stop(): void {
        if (!this.pollingInterval) {
            return;
        }

        clearInterval(
            this.pollingInterval
        );

        this.pollingInterval = null;
    }


    onPlaybackChange(
        callback: (
            playback: SpotifyPlayback
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

    //check if the song or state has changed
    private hasPlaybackChanged(
        previous: SpotifyPlayback | null,
        current: SpotifyPlayback
    ): boolean {
        if (!previous) {
            return true;
        }

        if (
            previous.isPlaying !==
            current.isPlaying
        ) {
            return true;
        }

        if (
            previous.track?.id !==
            current.track?.id
        ) {
            return true;
        }

        return false;
    }

}