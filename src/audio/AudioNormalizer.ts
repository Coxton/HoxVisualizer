import { FrequencyBands } from "./models/FrequencyBands";

export default class AudioNormalizer {
    private volumeMaximum = 0.0001;

    private readonly maxValues: FrequencyBands = {
        bass: 0.0001,
        lowMid: 0.0001,
        mid: 0.0001,
        highMid: 0.0001,
        treble: 0.0001
    };

    normalizeVolume(volume: number): number {
        this.volumeMaximum = Math.max(this.volumeMaximum, volume);

        return volume / this.volumeMaximum;
    }

    normalizeBands(bands: FrequencyBands): FrequencyBands {
        this.updateMaximums(bands);

        return {
            bass: bands.bass / this.maxValues.bass,
            lowMid: bands.lowMid / this.maxValues.lowMid,
            mid: bands.mid / this.maxValues.mid,
            highMid: bands.highMid / this.maxValues.highMid,
            treble: bands.treble / this.maxValues.treble
        };
    }

    normalizeSpectrum(magnitudes: Float32Array): Float32Array {
        let maximum = 0;

        for (const magnitude of magnitudes) {
            maximum = Math.max(maximum, magnitude);
        }

        if (maximum <= 0) {
            return new Float32Array(magnitudes.length);
        }

        const normalized = new Float32Array(magnitudes.length);

        for (let i = 0; i < magnitudes.length; i++) {
            normalized[i] = magnitudes[i] / maximum;
        }

        return normalized;
    }

    private updateMaximums(bands: FrequencyBands): void {
        this.maxValues.bass = Math.max(this.maxValues.bass, bands.bass);
        this.maxValues.lowMid = Math.max(this.maxValues.lowMid, bands.lowMid);
        this.maxValues.mid = Math.max(this.maxValues.mid, bands.mid);
        this.maxValues.highMid = Math.max(this.maxValues.highMid, bands.highMid);
        this.maxValues.treble = Math.max(this.maxValues.treble, bands.treble);
    }
}