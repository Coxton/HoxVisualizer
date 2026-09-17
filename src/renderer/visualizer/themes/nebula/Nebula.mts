import * as THREE from "three";
import NebulaGas from "./NebulaGas.mjs";
import NebulaCore from "./NebulaCore.mjs";

export default class Nebula {
    readonly points: THREE.Points;
    readonly gas: NebulaGas;
    readonly core: NebulaCore;


    constructor(scene: THREE.Scene) {
        const particleCount = 5000;

        const positions = new Float32Array(
            particleCount * 3
        );

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            const radius =
                Math.pow(Math.random(), 2) * 4;

            const spiralOffset =
                radius * 0.8;

            const theta =
                Math.random() * Math.PI * 2 +
                spiralOffset;

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );

            const irregularity =
                0.75 +
                Math.random() * 0.5;

            const x =
                radius *
                Math.sin(phi) *
                Math.cos(theta) *
                1.6 *
                irregularity;

            const y =
                radius *
                Math.sin(phi) *
                Math.sin(theta) *
                0.8 *
                irregularity;

            const z =
                radius *
                Math.cos(phi) *
                1.2 *
                irregularity;

            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;
        }

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
                size: 0.025,
                transparent: true,
                opacity: 0.6
            });

        this.points = new THREE.Points(
            geometry,
            material
        );

        scene.add(this.points);


        this.gas = new NebulaGas(scene);
        this.core = new NebulaCore(scene);
    }

    update(
            elapsedTime: number,
            bass: number
        ): void {
        this.points.rotation.y =
            elapsedTime * 0.02;

        this.points.rotation.x =
            elapsedTime * 0.005;

        this.gas.update(
            elapsedTime
        );
        this.core.update(
            elapsedTime,
            bass
        );    
    }
}