import type { AnalyzedAudio } from "../../../audio/models/AnalyzedAudio.js";

export interface VisualizerEffect {
    update(
        audio: AnalyzedAudio | null,
        elapsedTime: number
    ): void;
}