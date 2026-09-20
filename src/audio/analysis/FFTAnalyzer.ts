import FFT from "fft.js";
import { FrequencyData } from "../models/FrequencyData";

export default class FFTAnalyzer {

    private readonly fftSize = 1024;
    private readonly sampleRate = 48000;
    private readonly fft: FFT;

    constructor() {
        this.fft = new FFT(this.fftSize);
    }

    analyze(samples: Float32Array): FrequencyData {

        const input = new Array<number>(this.fftSize);

        //Declare a Hann Window for audio smoothing
        for (let i = 0; i < this.fftSize; i++) {

            const sample = samples[i] ?? 0;

            const window =
                0.5 * (1 - Math.cos((2 * Math.PI * i) / (this.fftSize - 1)));

            input[i] = sample * window;
        }

        const output = this.fft.createComplexArray();

        this.fft.realTransform(output, input);
        this.fft.completeSpectrum(output);

        const frequencies = new Float32Array(this.fftSize / 2 + 1);
        const magnitudes = new Float32Array(this.fftSize / 2 + 1);

        for (let i = 0; i <= this.fftSize / 2; i++) {

            const real = output[2 * i];
            const imaginary = output[2 * i + 1];

            frequencies[i] =
                i * this.sampleRate / this.fftSize;

            let magnitude =
                Math.sqrt(real * real + imaginary * imaginary);

            magnitude /= this.fftSize;

            magnitudes[i] = magnitude;
        }

        return {
            frequencies,
            magnitudes
        };
    }
}