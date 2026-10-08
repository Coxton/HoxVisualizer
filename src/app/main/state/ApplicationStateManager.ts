import type { ApplicationEvent } from "../events/ApplicationEvent";
import type { ApplicationState } from "./ApplicationState";

//Whatever the event, this is how the app reacts to it and changes the state
export default class ApplicationStateManager {

    private state: ApplicationState = {

        spotify: null

    };

    private readonly listeners:
        Set<
            (state: ApplicationState) => void
        > = new Set();


    get current(): ApplicationState {

        return this.state;
    }

    //handle Application wide Events
    handleEvent(
        event: ApplicationEvent
    ): void {
        if (
            event.type === "spotify.playback"
        ) {
            this.state.spotify =
                event.playback;

            this.emit();
        }
    }

    onChange(
        callback: (
            state: ApplicationState
        ) => void
    ): () => void {
        this.listeners.add(callback);

        return () => {
            this.listeners.delete(callback);
        };
    }


    private emit(): void {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

}