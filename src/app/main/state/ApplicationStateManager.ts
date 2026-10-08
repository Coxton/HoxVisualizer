import type { ApplicationEvent } from "../events/ApplicationEvent";
import type { ApplicationState } from "./ApplicationState";

//Whatever the event, this is how the app reacts to it and changes the state
export default class ApplicationStateManager {

    private state: ApplicationState = {

        spotify: null

    };


    get current(): ApplicationState {

        return this.state;
    }

    //handle Application wide Events
    handleEvent(
        event: ApplicationEvent
    ): void {
        if (
            event.type === 'spotify.playback'
        ) {

            this.state.spotify = event.playback;

        }
    }

}