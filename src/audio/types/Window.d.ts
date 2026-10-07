import { VisualAudio } from "../visual/models/VisualAudio.mjs";


//type declaration for the analyzed Audio
declare global {

    interface Window {

        audio: {

            onData(callback: (data: VisualAudio) => void): void;

        };

    }

}

export {};