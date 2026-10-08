import SpotifyAuth from "./SpotifyAuth";
import type { SpotifyPlayback, SpotifyTrack } from "../models/SpotifyTrack";
import type { SpotifyCurrentlyPlayingResponse } from "../responses/SpotifyCurrentlyPlayingResponse";
import SpotifyApiError from "./SpotifyAPIError";


export default class SpotifyClient {

    constructor(

        private readonly auth: SpotifyAuth

    ) {

    }

    //send request to spotify api
    private async request(
        endpoint: string
    ): Promise<Response> {
        const accessToken =
            await this.auth.getAccessToken();

        const response =
            await fetch(
                `https://api.spotify.com/v1/${endpoint}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );

        if (!response.ok) {
            const error =
                await response.json();

            throw new SpotifyApiError(
                response.status,
                error.error?.message ??
                    "Unknown Spotify API error"
            );
        }

        return response;
    }

    //get the current song playing
    async getCurrentlyPlaying(): Promise<SpotifyPlayback> {
        const response =
            await this.request(
                "me/player"
            );
         
        if (response.status === 204) {
            return {
                track: null,
                progressMs: null,
                isPlaying: false
            };
        }    


        const data =
            await response.json() as SpotifyCurrentlyPlayingResponse;

        const item = data.item;

        if (
            !item ||
            data.currently_playing_type !== "track"
        ) {
            return {
                track: null,
                progressMs: null,
                isPlaying: false
            };
        }

        const track: SpotifyTrack = {
            id: item.id,
            title: item.name,
            artists: item.artists.map(
                (artist: { name: string }) =>
                    artist.name
            ),
            album:      item.album.name,
            artworkUrl: item.album.images[0]?.url ?? null,
            durationMs: item.duration_ms,
        };


        

        return {
            track,
            progressMs: data.progress_ms,
            isPlaying: data.is_playing
        };
    }


}