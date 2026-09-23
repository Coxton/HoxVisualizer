import * as THREE from "three";
import type { AnalyzedAudio } from "../../../../audio/models/AnalyzedAudio.js";

import vertexShader
    from "./shaders/nebulaCore.vert.glsl?raw";

import fragmentShader
    from "./shaders/nebulaCore.frag.glsl?raw";

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
                                1.0,
                                0.12,
                                0.0
                            )
                    },

                    uGlowColor: {
                        value:
                            new THREE.Color(
                                1.0,
                                0.85,
                                0.15
                            )
                    },

                    uIntensity: {
                        value: 1.0
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
                    THREE.NormalBlending
            });

        this.mesh =
            new THREE.Mesh(
                geometry,
                this.material
            );

        scene.add(this.mesh);
    }

    update(
        elapsedTime: number,
        audio: AnalyzedAudio | null,
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
            audio?.frequencyBands.mid ?? 0;

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