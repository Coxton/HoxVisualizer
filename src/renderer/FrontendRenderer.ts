
import Visualizer from "../visualizer/Visualizer.mjs";
import type { VisualAudio } from "../audio/visual/models/VisualAudio.mjs";
import type { ApplicationState } from "../app/main/state/ApplicationState";
import NowPlayingHUD from "./components/hud/NowPlayingHUD";
import LayoutLoader from "./LayoutLoader";

export default class FrontendRenderer {
    private readonly visualizer: Visualizer;
    private readonly layoutLoader = new LayoutLoader();

    private nowPlayingHUD: NowPlayingHUD | null = null;
    private hudContainer: HTMLElement | null = null;
    private unsubscribeState: (() => void) | null = null;
    private pendingState: ApplicationState | null = null;

    constructor(
        private readonly onData: (
            callback: (data: VisualAudio) => void
        ) => void,
        private readonly onStateChange?: (
            callback: (state: ApplicationState) => void
        ) => (() => void)
    ) {
        this.visualizer = new Visualizer();
    }

    start(): void {
        this.visualizer.start();

        this.onData((data) => {
            this.update(data);
        });

        if (this.onStateChange) {
            this.unsubscribeState = this.onStateChange((state) => {
                this.pendingState = state;
                this.nowPlayingHUD?.update(state.spotify);
            });
        }
    }


    async initializeHUD(
        layout: string,
        root: HTMLElement = document.body
    ): Promise<void> {
        if (this.nowPlayingHUD) {
            return;
        }

        const container = document.createElement("div");
        container.className = "now-playing-hud-container";
        root.appendChild(container);

        this.hudContainer = container;

        try {
            this.layoutLoader.load(container, layout);

            this.nowPlayingHUD = new NowPlayingHUD(container);

            if (this.pendingState) {
                this.nowPlayingHUD.update(
                    this.pendingState.spotify
                );
            }
        } catch (error) {
            container.remove();
            this.hudContainer = null;
            throw error;
        }
    }


    update(data: VisualAudio): void {
        this.visualizer.update(data);
    }

    stop(): void {
        this.unsubscribeState?.();
        this.unsubscribeState = null;
    }
}
