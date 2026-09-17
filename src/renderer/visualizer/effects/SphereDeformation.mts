import * as THREE from "three";
import type { AnalyzedAudio } from "../../../audio/models/AnalyzedAudio.js";
import type { VisualizerEffect } from "./VisualizerEffect.js";


export default class SphereDeformation implements VisualizerEffect {

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

    update(
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

        //TODO::add back FFT Mapping

        let frequency = 0;

        if (spectrum) {
            frequency = spectrum[0];
        }

        const spectrumStrength = frequency * frequency;

        const audioInfluence =
            bassStrength;

        const deformation =
            1 +
            audioInfluence * 0.4 * wave +
            audioInfluence * 0.2 * secondaryWave;

        const minimumDeformation = 0.6;

        const safeDeformation =
            Math.max(deformation, minimumDeformation);

                    this.position.setXYZ(
                        i,
                        (x / length) * safeDeformation,
                        (y / length) * safeDeformation,
                        (z / length) * safeDeformation
                    );


            }

            this.position.needsUpdate = true;

            this.geometry.computeVertexNormals();
        }
}