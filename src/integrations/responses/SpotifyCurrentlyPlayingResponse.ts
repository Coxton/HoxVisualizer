export interface SpotifyCurrentlyPlayingResponse {
    item: {
        id: string;
        name: string;
        artists: {
            name: string;
        }[];
        album: {
            name: string;
            images: {
                url: string;
            }[];
        };
        duration_ms: number;
    } | null;

    progress_ms: number | null;
    is_playing: boolean;
    currently_playing_type:
    "track" |
    "episode" |
    "ad" |
    "unknown";
}