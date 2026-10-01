export default class SpectralFluxNormalizer {

    private reference = 0.0001;
    private initialized = false;

    private recoveryFrames = 0;

    private readonly recoveryFrameCount = 5;

    private readonly rise = 0.2;
    private readonly fall = 0.001;

    normalize(flux: number): number {

        //establish baseline after long pause
        if (!this.initialized) {

            this.reference = flux;
            this.initialized = true;
            this.recoveryFrames = 0;

            return 0;
        }

        this.updateReference(flux);

        if (this.recoveryFrames < this.recoveryFrameCount) {

            this.recoveryFrames++;

            return 0;
        }

        if (this.reference <= 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(1, flux / this.reference)
        );
    }

    reset(): void {
        this.reference = 0.0001;
        this.initialized = false;
        this.recoveryFrames = 0;
    }

    private updateReference(flux: number): void {

        if (flux > this.reference) {

            this.reference +=
                (flux - this.reference) * this.rise;

            return;
        }

        this.reference +=
            (flux - this.reference) * this.fall;
    }
}