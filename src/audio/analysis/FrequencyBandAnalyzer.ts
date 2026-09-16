import { FrequencyData } from "../models/FrequencyData";
import { FrequencyBands } from "../models/FrequencyBands";

export default class FrequencyBandAnalyzer {

    analyze(data: FrequencyData): FrequencyBands {

        return {
            bass: this.getBandAverage(data, 20, 250),
            lowMid: this.getBandAverage(data, 250, 500),
            mid: this.getBandAverage(data, 500, 2000),
            highMid: this.getBandAverage(data, 2000, 4000),
            treble: this.getBandAverage(data, 4000, 20000)
        };
    }

    private getBandAverage(
        data: FrequencyData,
        minFrequency: number,
        maxFrequency: number
    ): number {

        let sum = 0;
        let count = 0;

        for (let i = 0; i < data.frequencies.length; i++) {

            const frequency = data.frequencies[i];

            if (
                frequency >= minFrequency &&
                frequency < maxFrequency
            ) {
                sum += data.magnitudes[i];
                count++;
            }
        }

        return count > 0 ? sum / count : 0;
    }
}