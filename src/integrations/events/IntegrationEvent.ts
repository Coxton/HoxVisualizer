import type { SpotifyPlayback } from "../models/SpotifyTrack";


//Events that happen outside of the app
export type IntegrationEvent =
    | {
        type: "spotify.playback";
        playback: SpotifyPlayback;
    };