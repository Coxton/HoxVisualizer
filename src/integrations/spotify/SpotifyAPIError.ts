export default class SpotifyApiError
    extends Error {

    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);

        this.name =
            "SpotifyApiError";
    }
}