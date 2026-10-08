export interface SpotifyTrack {
    id: string;
    title: string;
    artists: string[];
    album: string;
    artworkUrl: string | null;
    durationMs: number;
}

export interface SpotifyPlayback {
    track: SpotifyTrack | null;
    progressMs: number | null;
    isPlaying: boolean;
}