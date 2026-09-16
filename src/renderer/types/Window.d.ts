import { AnalyzedAudio } from "../../audio/models/AnalyzedAudio.js";

declare global {

    interface Window {

        audio: {

            onData(callback: (data: AnalyzedAudio) => void): void;

        };

    }

}

export {};