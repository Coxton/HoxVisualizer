export default class SpectralFluxNormalizer {

    private reference = 0.0001;

    private readonly rise = 0.2;
    private readonly fall = 0.001;

    normalize(flux: number): number {

        this.updateReference(flux);

        if (this.reference <= 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(1, flux / this.reference)
        );
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