
import { ApplicationState } from "../app/main/state/ApplicationState";

export default class ApplicationStateClient {
    private state: ApplicationState | null = null;

    private readonly listeners =
        new Set<(state: ApplicationState) => void>();

    private unsubscribe: (() => void) | null = null;

    get current(): ApplicationState | null {
        return this.state;
    }

    start(): void {
        if (this.unsubscribe) {
            return;
        }

        this.unsubscribe = window.application.onStateChange((state) => {
            this.state = state;

            for (const listener of this.listeners) {
                listener(state);
            }
        });
    }

    stop(): void {
        if (!this.unsubscribe) {
            return;
        }

        this.unsubscribe();
        this.unsubscribe = null;
    }

    onChange(callback: (state: ApplicationState) => void): () => void {
        this.listeners.add(callback);

        if (this.state) {
            callback(this.state);
        }

        return () => {
            this.listeners.delete(callback);
        };
    }
}
