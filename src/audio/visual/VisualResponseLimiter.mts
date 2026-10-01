import type { AnalyzedAudio } from "../models/AnalyzedAudio.js";
import type { VisualAudio } from "./models/VisualAudio.mjs";

export default class VisualResponseLimiter {

    private readonly ceiling = 0.75;
    private readonly knee = 0.55;

    private intensity = 1.0;

    process(audio: AnalyzedAudio): VisualAudio {
        return {
            bass: this.limit(audio.frequencyBands.bass),
            lowMid: this.limit(audio.frequencyBands.lowMid),
            mid: this.limit(audio.frequencyBands.mid),
            highMid: this.limit(audio.frequencyBands.highMid),
            treble: this.limit(audio.frequencyBands.treble),

            impact: this.limit(audio.impact),
            impactEnvelope: this.limit(audio.impactEnvelope),

            vocalIntensity: this.limit(
                audio.frequencyBands.mid * 0.6 +
                audio.frequencyBands.highMid * 0.4
            )
        };
    }

    setIntensity(intensity: number): void {
        this.intensity = Math.max(
            0,
            Math.min(1, intensity)
        );
    }

    getIntensity(): number {
        return this.intensity;
    }

    private limit(value: number): number {
        const input = Math.max(0, Math.min(1, value));

        if (input <= this.knee) {
            return input * this.intensity;
        }

        const normalized =
            (input - this.knee) /
            (1 - this.knee);

        const compressed =
            1 - Math.exp(-normalized * 3);

        const normalizedCompression =
            compressed /
            (1 - Math.exp(-3));

        const result =
            this.knee +
            (this.ceiling - this.knee) * normalizedCompression;

        return Math.min(
            this.ceiling,
            result * this.intensity
        );
    }
}