import { FrequencyData } from "./FrequencyData";
import { FrequencyBands } from "./FrequencyBands";

export interface AnalyzedAudio {
    volume: number;
    peak: number;
    waveform: Float32Array;
    frequencyData: FrequencyData;
    normalizedSpectrum: Float32Array;
    frequencyBands: FrequencyBands;
    timestamp: number;
}