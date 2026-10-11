import type { VisualAudio } from "../../audio/visual/models/VisualAudio.mjs";
import type { ApplicationState } from "../main/state/ApplicationState";

export type WebSocketMessage =
    | {
        type: "audio";
        data: VisualAudio;
    }
    | {
        type: "application-state";
        data: ApplicationState;
    };