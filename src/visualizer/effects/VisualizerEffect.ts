import type { VisualAudio } from "../../audio/visual/models/VisualAudio.mjs";

export interface VisualizerEffect {
    update(
        audio: VisualAudio | null,
        elapsedTime: number
    ): void;
}