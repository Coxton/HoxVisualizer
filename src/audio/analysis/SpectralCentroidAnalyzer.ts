import { FrequencyData } from "../models/FrequencyData";

export default class SpectralCentroidAnalyzer {

    analyze(data: FrequencyData): number {

        let weightedFrequency = 0;
        let totalMagnitude = 0;

        for (let i = 0; i < data.frequencies.length; i++) {

            const frequency = data.frequencies[i];
            const magnitude = data.magnitudes[i];

            weightedFrequency += frequency * magnitude;
            totalMagnitude += magnitude;
        }

        if (totalMagnitude === 0) {
            return 0;
        }

        return weightedFrequency / totalMagnitude;
    }
}