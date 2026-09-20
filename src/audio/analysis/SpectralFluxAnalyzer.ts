import { FrequencyData } from "../models/FrequencyData";

export default class SpectralFluxAnalyzer {

    private previous: Float32Array | null = null;

    analyze(data: FrequencyData): number {

        if (!this.previous) {
            this.previous = new Float32Array(data.magnitudes);
            return 0;
        }

        let flux = 0;

        for (let i = 0; i < data.magnitudes.length; i++) {

            const difference =
                data.magnitudes[i] - this.previous[i];

            if (difference > 0) {
                flux += difference;
            }
        }

        this.previous.set(data.magnitudes);

        return flux;
    }
}