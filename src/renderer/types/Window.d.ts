import { AnalyzedAudio } from "../../audio/models/AnalyzedAudio.js";


//type declaration for the analyzed Audio
declare global {

    interface Window {

        audio: {

            onData(callback: (data: AnalyzedAudio) => void): void;

        };

    }

}

export {};