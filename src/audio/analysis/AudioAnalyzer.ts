import { AudioFrame }           from    "../models/AudioFrame";
import { AnalyzedAudio }        from    "../models/AnalyzedAudio";
import  FFTAnalyzer             from    "./FFTAnalyzer";
import FrequencyBandAnalyzer    from    "./FrequencyBandAnalyzer";
import AudioNormalizer          from    "../AudioNormalizer";
import AudioSmoother            from    "../AudioSmoother";

export default class AudioAnalyzer {

    private readonly fftAnalyzer            = new FFTAnalyzer();
    private readonly frequencyBandAnalyzer  = new FrequencyBandAnalyzer();
    private readonly normalizer             = new AudioNormalizer();
    private readonly smoother               = new AudioSmoother();


    analyze(frame: AudioFrame): AnalyzedAudio {

        const samples = this.convertToFloat32(frame.data);

        const frequencyData = this.fftAnalyzer.analyze(samples);

        const normalizedSpectrum =
            this.normalizer.normalizeSpectrum(
                frequencyData.magnitudes
            );

        const frequencyBands = this.frequencyBandAnalyzer.analyze(frequencyData);

        const volume = this.calculateRMS(samples);

        const normalizedVolume = this.normalizer.normalizeVolume(volume);
        const normalizedBands = this.normalizer.normalizeBands(frequencyBands);

        const smoothedBands = this.smoother.smooth(normalizedBands);



        return {
            volume: normalizedVolume,
            peak: this.calculatePeak(samples),
            waveform: samples,
            frequencyData,
            normalizedSpectrum,
            frequencyBands: smoothedBands,
            timestamp: frame.timestamp
        };
    }

    private convertToFloat32(data: Buffer): Float32Array {
        const samples = new Float32Array(data.length / 2);

        for (let i = 0; i < samples.length; i++) {
            samples[i] = data.readInt16LE(i * 2) / 32768;
        }

        return samples;
    }

    private calculateRMS(samples: Float32Array): number {

        let sum = 0;

        for (const sample of samples) {
            sum += sample * sample;
        }

        return Math.sqrt(sum / samples.length);
    }

    private calculatePeak(samples: Float32Array): number {

        let peak = 0;

        for (const sample of samples) {
            const amplitude = Math.abs(sample);

            if (amplitude > peak) {
                peak = amplitude;
            }
        }

        return peak;
    }
}