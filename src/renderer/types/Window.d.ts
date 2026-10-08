
import type { VisualAudio } from "../../audio/visual/models/VisualAudio.mjs";
import type { ApplicationState } from "../../app/main/state/ApplicationState";

declare global {
    interface Window {
        audio: {
            onData(callback: (data: VisualAudio) => void): void;
        };

        application: {
            onStateChange(
                callback: (state: ApplicationState) => void
            ): () => void;
        };
    }
}

export {};