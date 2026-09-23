import * as THREE from "three";
import starVertexShader from "./shaders/star.vert.glsl?raw";

import starFragmentShader from "./shaders/star.frag.glsl?raw";

export default class StarField {

    readonly points: THREE.Group;

    constructor(scene: THREE.Scene) {

        this.points =
            new THREE.Group();

        scene.add(this.points);

        this.createStarLayer(
            2200,
            0.12,
            0.45
        );

        this.createStarLayer(
            450,
            0.18,
            0.65
        );

        this.createStarLayer(
            60,
            0.25,
            0.9
        );
    }


    private createStarLayer(
    particleCount: number,
    size: number,
    opacity: number
): void {

    const positions =
        new Float32Array(
            particleCount * 3
        );

    const sizes =
        new Float32Array(
            particleCount
        );

    const brightness =
        new Float32Array(
            particleCount
        );

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const index = i * 3;

            positions[index] =
                (Math.random() - 0.5) * 100;

            positions[index + 1] =
                (Math.random() - 0.5) * 100;

            positions[index + 2] =
                (Math.random() - 0.5) * 100;

            sizes[i] =
                size *
                (
                    0.75 +
                    Math.random() * 0.5
                );

            brightness[i] =
                opacity *
                (
                    0.75 +
                    Math.random() * 0.25
                );
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

        geometry.setAttribute(
            "aSize",
            new THREE.BufferAttribute(
                sizes,
                1
            )
        );

        geometry.setAttribute(
            "aBrightness",
            new THREE.BufferAttribute(
                brightness,
                1
            )
        );



        const material =
            new THREE.ShaderMaterial({

                uniforms: {},

                vertexShader:
                    starVertexShader,

                fragmentShader:
                    starFragmentShader,

                transparent: true,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });

        const stars =
            new THREE.Points(
                geometry,
                material
            );

        this.points.add(stars);
    }

}