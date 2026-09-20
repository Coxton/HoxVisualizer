import { FrequencyData } from "./FrequencyData";
import { FrequencyBands } from "./FrequencyBands";
import { TransientBands } from "./TransientBands";


//Expected model structure for Audio that has been analyzed
export interface AnalyzedAudio {

    volume: number;
    peak: number;
    waveform: Float32Array;

    frequencyData: FrequencyData;
    normalizedSpectrum: Float32Array;

    frequencyBands: FrequencyBands;
    transients: TransientBands;

    spectralFlux: number;
    spectralCentroid: number;

    impact: number;
    impactEnvelope: number;

    timestamp: number;
}