import type { SpotifyPlayback } from "../../../integrations/models/SpotifyTrack";

//Events that are relevant to the app
export type ApplicationEvent =
    | {
        type: "spotify.playback";
        playback: SpotifyPlayback;
    };