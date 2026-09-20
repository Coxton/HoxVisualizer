import { FrequencyBands } from "./models/FrequencyBands";

export default class AudioNormalizer {
    //set max volume
    private volumeMaximum = 0.0001;


    private readonly referenceRise = 0.2;
    private readonly referenceFall = 0.001;



    private readonly referenceLevels: FrequencyBands = {
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
        this.updateReferenceLevels(bands);

        return {
            bass: this.clamp(bands.bass / this.referenceLevels.bass),
            lowMid: this.clamp(bands.lowMid / this.referenceLevels.lowMid),
            mid: this.clamp(bands.mid / this.referenceLevels.mid),
            highMid: this.clamp(bands.highMid / this.referenceLevels.highMid),
            treble: this.clamp(bands.treble / this.referenceLevels.treble)
        };
    }

    //create a clamp for the audio volumes so they may never exceed 1 -> 0-1
    private clamp(value: number): number {
        return Math.max(0, Math.min(1, value));
    }

    //normalize values for ease of readability and usability
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

    private updateReference(current: number, target: number): number {

        if (target > current) {
            return current + (target - current) * this.referenceRise;
        }

        return current + (target - current) * this.referenceFall;
    }

    private updateReferenceLevels(bands: FrequencyBands): void {

        this.referenceLevels.bass =
            this.updateReference(this.referenceLevels.bass, bands.bass);

        this.referenceLevels.lowMid =
            this.updateReference(this.referenceLevels.lowMid, bands.lowMid);

        this.referenceLevels.mid =
            this.updateReference(this.referenceLevels.mid, bands.mid);

        this.referenceLevels.highMid =
            this.updateReference(this.referenceLevels.highMid, bands.highMid);

        this.referenceLevels.treble =
            this.updateReference(this.referenceLevels.treble, bands.treble);
    }
}