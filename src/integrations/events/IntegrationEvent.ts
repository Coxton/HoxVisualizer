import type { SpotifyPlayback } from "../models/SpotifyTrack";

export type IntegrationEvent =
    | {
        type: "spotify.playback";
        playback: SpotifyPlayback;
    };