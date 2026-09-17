import type { AnalyzedAudio } from "../../../audio/models/AnalyzedAudio.js";
import type { VisualizerEffect } from "./VisualizerEffect.js";

export default class EffectManager {

    private readonly effects: VisualizerEffect[] = [];
    private activeEffect: VisualizerEffect | null = null;

    addEffect(effect: VisualizerEffect): void {
        this.effects.push(effect);
    }

    setActiveEffect(effect: VisualizerEffect): void {
        this.activeEffect = effect;
    }

    update(
        audio: AnalyzedAudio | null,
        elapsedTime: number
    ): void {
        for (const effect of this.effects) {
            effect.update(
                audio,
                elapsedTime
            );
        }
    }
}