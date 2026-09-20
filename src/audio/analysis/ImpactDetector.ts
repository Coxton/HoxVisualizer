import { TransientBands } from "../models/TransientBands";

export default class ImpactDetector {

    private readonly bassWeight     = 1.0;
    private readonly lowMidWeight   = 0.8;
    private readonly midWeight      = 0.7;
    private readonly highMidWeight  = 0.6;
    private readonly trebleWeight   = 0.5;

    calculate(
        transients: TransientBands,
        normalizedSpectralFlux: number
    ): number {

        const bandImpact =
            Math.max(
                transients.bass * this.bassWeight,
                transients.lowMid * this.lowMidWeight,
                transients.mid * this.midWeight,
                transients.highMid * this.highMidWeight,
                transients.treble * this.trebleWeight
            );

        const impact =
            bandImpact * 0.6 +
            normalizedSpectralFlux * 0.4;

        return Math.max(0, Math.min(1, impact));
    }
}