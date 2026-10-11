
import type { SpotifyPlayback } from "../../../integrations/models/SpotifyTrack";

export default class NowPlayingHUD {
    private readonly title: HTMLElement;
    private readonly artist: HTMLElement;
    private readonly artwork: HTMLImageElement;
    private readonly artworkPlaceholder: HTMLElement;
    private readonly status: HTMLElement;
    private readonly statusLabel: HTMLElement;
    private readonly titleContainer: HTMLElement;

    constructor(root: HTMLElement) {
        this.title = this.getElement(root, "#now-playing-title");
        this.artist = this.getElement(root, "#now-playing-artist");
        this.artwork = this.getElement(
            root,
            "#now-playing-artwork"
        ) as HTMLImageElement;
        this.artworkPlaceholder = this.getElement(
            root,
            "#now-playing-artwork-placeholder"
        );
        this.status = this.getElement(root, "#now-playing-status");
        this.statusLabel = this.getElement(
            root,
            "#now-playing-status-label"
        );
        this.titleContainer = this.getElement(
            root,
            ".now-playing__title-container"
        );
    }

    update(playback: SpotifyPlayback | null): void {
        const track = playback?.track ?? null;

        this.title.textContent = track?.title ?? "Nothing playing";
        this.artist.textContent =
            track?.artists.join(", ") || "Waiting for Spotify";

        this.updateArtwork(track?.artworkUrl ?? null);
        this.updateStatus(
            track ? playback?.isPlaying ?? false : false
        );
        this.updateTitleScrolling();
    }

    private updateArtwork(url: string | null): void {
        this.artwork.onload = () => {
            this.artwork.hidden = false;
            this.artworkPlaceholder.hidden = true;
        };

        this.artwork.onerror = () => {
            this.artwork.hidden = true;
            this.artworkPlaceholder.hidden = false;
        };

        if (!url) {
            this.artwork.removeAttribute("src");
            this.artwork.hidden = true;
            this.artworkPlaceholder.hidden = false;
            return;
        }

        if (this.artwork.getAttribute("src") !== url) {
            this.artwork.hidden = true;
            this.artworkPlaceholder.hidden = false;
            this.artwork.src = url;
        } else if (
            this.artwork.complete &&
            this.artwork.naturalWidth > 0
        ) {
            this.artwork.hidden = false;
            this.artworkPlaceholder.hidden = true;
        }
    }

    private updateStatus(isPlaying: boolean): void {
        this.statusLabel.textContent = isPlaying ? "Playing" : "Paused";
        this.status.classList.toggle("is-playing", isPlaying);
        this.status.classList.toggle("is-paused", !isPlaying);
    }

    private updateTitleScrolling(): void {
        this.title.classList.remove("is-scrolling");
        this.title.style.removeProperty("--title-overflow");

        requestAnimationFrame(() => {
            const overflow =
                this.title.scrollWidth -
                this.titleContainer.clientWidth;

            if (overflow > 8) {
                this.title.style.setProperty(
                    "--title-overflow",
                    `${overflow}px`
                );
                this.title.classList.add("is-scrolling");
            }
        });
    }

    private getElement(
        root: HTMLElement,
        selector: string
    ): HTMLElement {
        const element = root.querySelector<HTMLElement>(selector);

        if (!element) {
            throw new Error(
                `NowPlayingHUD element not found: ${selector}`
            );
        }

        return element;
    }
}
