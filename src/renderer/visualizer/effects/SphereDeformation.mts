import * as THREE from "three";
import type { AnalyzedAudio } from "../../../audio/models/AnalyzedAudio.js";

export default class SphereDeformation {

    private readonly geometry: THREE.SphereGeometry;
    private readonly position: THREE.BufferAttribute;
    private readonly originalPositions: Float32Array;

    constructor(geometry: THREE.SphereGeometry) {
        this.geometry = geometry;

        this.position =
            geometry.getAttribute("position") as THREE.BufferAttribute;

        this.originalPositions =
            new Float32Array(this.position.array);
    }

    apply(
    audio: AnalyzedAudio | null,
    elapsedTime: number
): void {

    const bass = audio?.frequencyBands.bass ?? 0;

    const spectrum = audio?.normalizedSpectrum;

    for (let i = 0; i < this.position.count; i++) {

        const x = this.originalPositions[i * 3];
        const y = this.originalPositions[i * 3 + 1];
        const z = this.originalPositions[i * 3 + 2];

        const length = Math.sqrt(
            x * x +
            y * y +
            z * z
        );

        const wave = Math.sin(
            y * 8 +
            elapsedTime * 2
        );

        const secondaryWave = Math.sin(
            x * 6 +
            elapsedTime * 1.5
        );

        const bassStrength = bass * bass;

        const angle = Math.atan2(z, x);
        const normalizedAngle =
            (angle + Math.PI) / (2 * Math.PI);

        const frequencyIndex = Math.floor(
            normalizedAngle * (spectrum?.length ?? 1)
        );

        let frequency = 0;

        if (spectrum) {

            const range = 3;

            let sum = 0;
            let count = 0;

            for (
                let offset = -range;
                offset <= range;
                offset++
            ) {

                const spectrumLength = spectrum.length;

                const index =
                    (frequencyIndex + offset + spectrumLength) %
                    spectrumLength;

                sum += spectrum[index];
                count++;
            }

            frequency = count > 0
                ? sum / count
                : 0;
        }

        const spectrumStrength = frequency * frequency;

        const deformation =
            1 +
            bassStrength * 0.4 * wave +
            bassStrength * 0.2 * secondaryWave +
            spectrumStrength * 0.25 * wave;

        this.position.setXYZ(
            i,
            (x / length) * deformation,
            (y / length) * deformation,
            (z / length) * deformation
        );

        if (deformation <= 0) {
            console.log("Invalid deformation:", deformation);
        }
    }

    this.position.needsUpdate = true;

    this.geometry.computeVertexNormals();
}
}