import * as THREE from "three";

export default class NebulaGas {
    readonly points: THREE.Points;

    private readonly originalPositions: Float32Array;
    private readonly motionOffsets: Float32Array;

    constructor(scene: THREE.Scene) {
        const particleCount = 6000;
        const armCount = 4;

        const positions = new Float32Array(
            particleCount * 3
        );

        this.motionOffsets = new Float32Array(
            particleCount
        );

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            const arm =
                Math.floor(
                    Math.random() * armCount
                );

            const radius =
                Math.pow(
                    Math.random(),
                    0.7
                ) * 5;

            const armAngle =
                (arm / armCount) *
                Math.PI * 2;

            const spiralAngle =
                armAngle +
                radius * 0.7;

            const spread =
                (Math.random() - 0.5) *
                0.8;

            const angle =
                spiralAngle + spread;

            const x =
                Math.cos(angle) *
                radius *
                1.5;

            const y =
                (Math.random() - 0.5) *
                1.2;

            const z =
                Math.sin(angle) *
                radius *
                0.8;

            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;

            this.motionOffsets[i] =
                Math.random() * Math.PI * 2;
        }

        this.originalPositions =
            positions.slice();

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const material =
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.018,
                transparent: true,
                opacity: 0.35
            });

        this.points = new THREE.Points(
            geometry,
            material
        );

        scene.add(this.points);
    }

    update(elapsedTime: number): void {
        this.points.rotation.y =
            elapsedTime * 0.015;

        const positionAttribute =
            this.points.geometry.getAttribute(
                "position"
            ) as THREE.BufferAttribute;

        for (
            let i = 0;
            i < positionAttribute.count;
            i++
        ) {
            const index = i * 3;

            const x =
                this.originalPositions[index];

            const y =
                this.originalPositions[index + 1];

            const z =
                this.originalPositions[index + 2];

            const offset =
                this.motionOffsets[i];

            const horizontalWave =
                Math.sin(
                    elapsedTime * 0.7 +
                    offset +
                    y * 2
                );

            const verticalWave =
                Math.cos(
                    elapsedTime * 0.5 +
                    offset +
                    x * 1.5
                );

            const radialWave =
                Math.sin(
                    elapsedTime * 0.4 +
                    offset +
                    Math.sqrt(x * x + z * z) * 2
                );

            const displacement =
                0.035;

            positionAttribute.setXYZ(
                i,
                x +
                    horizontalWave *
                    displacement,

                y +
                    verticalWave *
                    displacement,

                z +
                    radialWave *
                    displacement
            );
        }

        positionAttribute.needsUpdate = true;
    }
}