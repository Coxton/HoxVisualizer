export interface NowPlayingTrack {
    title: string;
    artist: string;
    artworkUrl?: string;
}

export default class NowPlaying {
    private readonly titleElement: HTMLElement;
    private readonly artistElement: HTMLElement;
    private readonly artworkElement: HTMLElement;
    private readonly statusElement: HTMLElement;
    private readonly statusLabel: HTMLElement;

    constructor(root: HTMLElement) {
        const title = root.querySelector<HTMLElement>(
            "#now-playing-title"
        );

        const artist = root.querySelector<HTMLElement>(
            "#now-playing-artist"
        );

        const artwork = root.querySelector<HTMLElement>(
            ".now-playing__artwork"
        );

        const status = root.querySelector<HTMLElement>(
            "#now-playing-status"
        );

        const statusLabel = root.querySelector<HTMLElement>(
            ".now-playing__status-label"
        );

        if (
            !title ||
            !artist ||
            !artwork ||
            !status ||
            !statusLabel
        ) {
            throw new Error(
                "NowPlaying: required HTML elements are missing."
            );
        }

        this.titleElement = title;
        this.artistElement = artist;
        this.artworkElement = artwork;
        this.statusElement = status;
        this.statusLabel = statusLabel;
    }

    setTrack(track: NowPlayingTrack | null): void {
        if (!track) {
            this.titleElement.textContent = "Nothing playing";
            this.artistElement.textContent = "Waiting for Spotify";

            this.setArtwork(null);
            this.setStatus("Waiting");

            return;
        }

        this.titleElement.textContent = track.title;
        this.artistElement.textContent = track.artist;

        this.setArtwork(track.artworkUrl ?? null);
        this.setStatus("Connected");
    }

    setStatus(status: string): void {
        this.statusLabel.textContent = status;

        this.statusElement.setAttribute(
            "aria-label",
            `Playback status: ${status}`
        );

        this.statusElement.dataset.status =
            status.toLowerCase();
    }

    private setArtwork(url: string | null): void {
        this.artworkElement
            .querySelector(".now-playing__artwork-image")
            ?.remove();

        const placeholder =
            this.artworkElement.querySelector<HTMLElement>(
                ".now-playing__artwork-placeholder"
            );

        if (!url) {
            if (placeholder) {
                placeholder.hidden = false;
            }

            return;
        }

        const image = document.createElement("img");

        image.className = "now-playing__artwork-image";
        image.alt = "Album artwork";
        image.src = url;

        image.addEventListener("error", () => {
            image.remove();

            if (placeholder) {
                placeholder.hidden = false;
            }
        });

        if (placeholder) {
            placeholder.hidden = true;
        }

        this.artworkElement.appendChild(image);
    }
}