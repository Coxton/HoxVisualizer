import * as THREE from "three";

import starVertexShader
    from "./shaders/star.vert.glsl?raw";

import starFragmentShader
    from "./shaders/star.frag.glsl?raw";


export default class StarLayer {

    readonly points: THREE.Points;

    private readonly material:
        THREE.ShaderMaterial;


    constructor(
        particleCount: number,
        size: number,
        opacity: number
    ) {

        const geometry =
            this.createGeometry(
                particleCount,
                size,
                opacity
            );


        this.material =
            new THREE.ShaderMaterial({

                uniforms: {
                    uTime: {
                        value: 0
                    }
                },

                vertexShader:
                    starVertexShader,

                fragmentShader:
                    starFragmentShader,

                transparent: true,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        this.points =
            new THREE.Points(
                geometry,
                this.material
            );
    }


    update(time: number): void {

        this.material
            .uniforms
            .uTime
            .value =
            time;
    }


    private createGeometry(
        particleCount: number,
        size: number,
        opacity: number
    ): THREE.BufferGeometry {

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

        const movement =
            new Float32Array(
                particleCount * 3
            );

        const phase =
            new Float32Array(
                particleCount
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const index =
                i * 3;


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


            movement[index] =
                (Math.random() - 0.5) * 0.08;

            movement[index + 1] =
                (Math.random() - 0.5) * 0.08;

            movement[index + 2] =
                (Math.random() - 0.5) * 0.08;


            phase[i] =
                Math.random() *
                Math.PI *
                2;
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


        geometry.setAttribute(
            "aMovement",
            new THREE.BufferAttribute(
                movement,
                3
            )
        );


        geometry.setAttribute(
            "aPhase",
            new THREE.BufferAttribute(
                phase,
                1
            )
        );


        return geometry;
    }
}