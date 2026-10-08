import type { SpotifyPlayback } from "../../../integrations/models/SpotifyTrack";

//passive representation of what app currently knows
export interface ApplicationState {
    spotify: SpotifyPlayback | null;
}