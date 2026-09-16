import { FrequencyBands } from "./models/FrequencyBands";

export default class AudioNormalizer {

    private readonly maxValues: FrequencyBands = {
        bass: 0.0001,
        lowMid: 0.0001,
        mid: 0.0001,
        highMid: 0.0001,
        treble: 0.0001
    };

    normalize(bands: FrequencyBands): FrequencyBands {

        this.updateMaximums(bands);

        return {
            bass: bands.bass / this.maxValues.bass,
            lowMid: bands.lowMid / this.maxValues.lowMid,
            mid: bands.mid / this.maxValues.mid,
            highMid: bands.highMid / this.maxValues.highMid,
            treble: bands.treble / this.maxValues.treble
        };
    }

    private updateMaximums(bands: FrequencyBands): void {

        this.maxValues.bass =
            Math.max(this.maxValues.bass, bands.bass);

        this.maxValues.lowMid =
            Math.max(this.maxValues.lowMid, bands.lowMid);

        this.maxValues.mid =
            Math.max(this.maxValues.mid, bands.mid);

        this.maxValues.highMid =
            Math.max(this.maxValues.highMid, bands.highMid);

        this.maxValues.treble =
            Math.max(this.maxValues.treble, bands.treble);
    }
}