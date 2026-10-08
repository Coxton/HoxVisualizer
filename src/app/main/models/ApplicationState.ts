import type { SpotifyPlayback } from "../../../integrations/models/SpotifyTrack";

export interface ApplicationState {
    spotify: SpotifyPlayback | null;
}