import { AudioFrame }           from    "../models/AudioFrame";
import { AnalyzedAudio }        from    "../models/AnalyzedAudio";
import  FFTAnalyzer             from    "./FFTAnalyzer";
import FrequencyBandAnalyzer    from    "./FrequencyBandAnalyzer";
import AudioNormalizer          from    "../normaliser/AudioNormalizer";
import AudioSmoother            from    "../AudioSmoother";
import TransientDetector        from    "../detector/TransientDetector";
import SpectralFluxAnalyzer     from    "./SpectralFluxAnalyzer";
import SpectralCentroidAnalyzer from    "./SpectralCentroidAnalyzer";
import SpectralFluxNormalizer   from    "../normaliser/SpectralFluxNormalizer";
import ImpactDetector           from    "../detector/ImpactDetector";
import ImpactEnvelope           from    "./ImpactEnvelope";

export default class AudioAnalyzer {

    private readonly fftAnalyzer                = new FFTAnalyzer();
    private readonly frequencyBandAnalyzer      = new FrequencyBandAnalyzer();
    private readonly normalizer                 = new AudioNormalizer();
    private readonly smoother                   = new AudioSmoother();
    private readonly transientDetector          = new TransientDetector();
    private readonly spectralFluxAnalyzer       = new SpectralFluxAnalyzer();
    private readonly spectralCentroidAnalyzer   = new SpectralCentroidAnalyzer();
    private readonly spectralFluxNormalizer     = new SpectralFluxNormalizer();
    private readonly impactDetector             = new ImpactDetector();
    private readonly impactEnvelope             = new ImpactEnvelope();
    
    //Check if Audio is idle
    private lastFrameTimestamp = 0;
    private recoveryFrames = 0;
    private wasReceivingAudio = false;

    //debug
    private debugTimer = 0;


    analyze(frame: AudioFrame): AnalyzedAudio {

        if (
            this.lastFrameTimestamp > 0 &&
            frame.timestamp - this.lastFrameTimestamp > 500
        ) {
            this.wasReceivingAudio = false;

            this.resetAnalysisState();
        }

        this.lastFrameTimestamp = frame.timestamp;

        if (!this.wasReceivingAudio) {
            this.wasReceivingAudio = true;
            this.recoveryFrames = 10;

        }

        //Convert raw audio Samples -> Float
        const samples = this.convertToFloat32(frame.data);

        //Run FFT algorythm on collected samples
        const frequencyData = this.fftAnalyzer.analyze(samples);

        //normalize fft analyzed data
        const normalizedSpectrum =
            this.normalizer.normalizeSpectrum(
                frequencyData.magnitudes
            );

        //determine frequency range of collected audio sample    
        const frequencyBands = this.frequencyBandAnalyzer.analyze(frequencyData);
        
        //determine how loud the collected audio sample is 
        const volume = this.calculateRMS(samples);
        const peak   = this.calculatePeak(samples);

        //Normalize Volume and Band volumes
        const normalizedVolume = this.normalizer.normalizeVolume(volume);
        const normalizedBands = this.normalizer.normalizeBands(frequencyBands);

        //DEBUG
        /* if (frame.timestamp - this.debugTimer > 5000) {

            this.debugTimer = frame.timestamp;

            const debug = this.normalizer.getDebugState();

            console.log("=== NORMALIZER DEBUG ===");

            console.log("Volume Maximum:", debug.volumeMaximum);

            console.log(
                "Bass:",
                "raw =", frequencyBands.bass,
                "ref =", debug.referenceLevels.bass,
                "norm =", normalizedBands.bass
            );

            console.log(
                "Low Mid:",
                "raw =", frequencyBands.lowMid,
                "ref =", debug.referenceLevels.lowMid,
                "norm =", normalizedBands.lowMid
            );

            console.log(
                "Mid:",
                "raw =", frequencyBands.mid,
                "ref =", debug.referenceLevels.mid,
                "norm =", normalizedBands.mid
            );

            console.log(
                "High Mid:",
                "raw =", frequencyBands.highMid,
                "ref =", debug.referenceLevels.highMid,
                "norm =", normalizedBands.highMid
            );

            console.log(
                "Treble:",
                "raw =", frequencyBands.treble,
                "ref =", debug.referenceLevels.treble,
                "norm =", normalizedBands.treble
            );
        } */


        //further smooth the band values    
        const smoothedBands = this.smoother.smooth(normalizedBands);
        
        //calculate transients -> Audio falloff basically
        const transients = this.transientDetector.detect(smoothedBands);
        
        //calculate the peak of the collected sample    
        const spectralFlux =
                this.spectralFluxAnalyzer.analyze(frequencyData);
        
        //normalize value of peak volume   
        const normalizedSpectralFlux =
            this.spectralFluxNormalizer.normalize(spectralFlux);       
        
        //detect a big impact of bass/mid/highs    
        const impact =
            this.impactDetector.calculate(
                transients,
                normalizedSpectralFlux,
                peak
            );
        
        // remember a big impact of audio and gradually decline from said peak    
        const impactEnvelope =
            this.impactEnvelope.process(impact);
            
        if (this.recoveryFrames > 0) {

            this.recoveryFrames--;
        }    

            
        
        //determine spectral centroid of collected sample
        const spectralCentroid =
                this.spectralCentroidAnalyzer.analyze(frequencyData);


        //declare expected return object        
        return {
            volume: normalizedVolume,
            peak: peak,
            waveform: samples,
            frequencyData,
            normalizedSpectrum,
            frequencyBands: smoothedBands,
            transients,
            spectralFlux,
            spectralCentroid,
            impact,
            impactEnvelope,
            timestamp: frame.timestamp
        };
    }


    //convert audio sample to Float32 for further processing
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

    private resetAnalysisState(): void {
        this.normalizer.reset();
        this.smoother.reset();
        this.transientDetector.reset();
        this.spectralFluxNormalizer.reset();
        this.impactEnvelope.reset();

        this.debugTimer = 0;
    }
}