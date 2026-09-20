import { FrequencyData } from "../models/FrequencyData";
import { FrequencyBands } from "../models/FrequencyBands";

export default class FrequencyBandAnalyzer {

    //analyze data for bass/mids/treble
    analyze(data: FrequencyData): FrequencyBands {

        return {
            bass: this.getBandAverage(data, 20, 150),
            lowMid: this.getBandAverage(data, 150, 400),
            mid: this.getBandAverage(data, 400, 2000),
            highMid: this.getBandAverage(data, 2000, 6000),
            treble: this.getBandAverage(data, 6000, 20000)
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