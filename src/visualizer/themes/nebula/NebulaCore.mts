import * as THREE from "three";

import vertexShader
    from "./shaders/nebulaCore.vert.glsl?raw";

import fragmentShader
    from "./shaders/nebulaCore.frag.glsl?raw";

import type { VisualAudio }
    from "../../../audio/visual/models/VisualAudio.mjs";


export default class NebulaCore {

    readonly mesh: THREE.Mesh;

    private readonly material:
        THREE.ShaderMaterial;


    constructor(scene: THREE.Scene) {

        const geometry =
            new THREE.BoxGeometry(
                5,
                3.5,
                5
            );


        this.material =
            new THREE.ShaderMaterial({

                uniforms: {

                    uCameraPosition: {
                        value:
                            new THREE.Vector3()
                    },

                    uCoreColor: {
                        value:
                            new THREE.Color(
                                0.55,
                                0.85,
                                1.0
                            )
                    },

                    uGlowColor: {
                        value:
                            new THREE.Color(
                                0.92,
                                0.98,
                                1.0
                            )
                    },

                    uIntensity: {
                        value: 2.3
                    },

                    uTime: {
                        value: 0
                    },

                    uMid: {
                        value: 0
                    },

                    uImpact: {
                        value: 0
                    }
                },

                vertexShader,

                fragmentShader,

                transparent: true,

                depthWrite: false,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending
            });


        this.mesh =
            new THREE.Mesh(
                geometry,
                this.material
            );


        scene.add(
            this.mesh
        );
    }


    update(
        elapsedTime: number,
        audio: VisualAudio | null,
        camera: THREE.Camera
    ): void {

        this.material
            .uniforms
            .uTime
            .value =
            elapsedTime;


        this.material
            .uniforms
            .uMid
            .value =
            audio?.mid ?? 0;


        this.material
            .uniforms
            .uImpact
            .value =
            audio?.impactEnvelope ?? 0;


        const localCameraPosition =
            this.mesh.worldToLocal(
                camera.position.clone()
            );


        this.material
            .uniforms
            .uCameraPosition
            .value
            .copy(
                localCameraPosition
            );
    }
}