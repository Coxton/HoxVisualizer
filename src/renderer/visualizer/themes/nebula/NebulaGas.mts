import * as THREE from "three";
import type { AnalyzedAudio } from "../../../../audio/models/AnalyzedAudio.js";

import vertexShader
    from "./shaders/nebulaGas.vert.glsl?raw";

import fragmentShader
    from "./shaders/nebulaGas.frag.glsl?raw";

export default class NebulaGas {

    readonly mesh: THREE.Mesh;

    private readonly material:
        THREE.ShaderMaterial;

    private visualMid = 0;
    private vocalResponse = 0;

    constructor(scene: THREE.Scene) {

        const geometry =
            new THREE.BoxGeometry(
                16,
                7,
                10
            );

        this.material =
            new THREE.ShaderMaterial({

                uniforms: {
                    uTime: {
                        value: 0
                    },

                    uBass: {
                        value: 0
                    },

                    uLowMid: {
                        value: 0
                    },

                    uMid: {
                        value: 0
                    },

                    uCameraPosition: {
                        value:
                            new THREE.Vector3()
                    },

                    uLightPosition: {
                        value:
                            new THREE.Vector3(0, 0, 0)
                    },

                    uCorePosition: {
                        value:
                            new THREE.Vector3(0, 0, 0)
                    },

                    uCoreIntensity: {
                        value: 1.0
                    },

                    uOuterColor: {
                        value:
                            new THREE.Color(
                                0.75,
                                0.025,
                                0.005
                            )
                    },

                    uMidColor: {
                        value:
                            new THREE.Color(
                                1.0,
                                0.28,
                                0.015
                            )
                    },

                    uInnerColor: {
                        value:
                            new THREE.Color(
                                0.015,
                                0.22,
                                1.0
                            )
                    },

                    uVocalIntensity: {
                        value: 0
                    }
                },

                vertexShader,

                fragmentShader,

                transparent: true,

                depthWrite: false,

                side: THREE.BackSide
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
        camera: THREE.Camera,
        corePosition: THREE.Vector3
    ): void {

        this.material
            .uniforms
            .uTime
            .value =
            elapsedTime;

        this.material
            .uniforms
            .uBass
            .value =
            audio?.frequencyBands.bass ?? 0;

        this.material
            .uniforms
            .uLowMid
            .value =
            audio?.frequencyBands.lowMid ?? 0;

        const targetMid =
            audio?.frequencyBands.mid ?? 0;

        const midResponse =
            targetMid > this.visualMid
                ? 0.25
                : 0.04;

        this.visualMid +=
            (targetMid - this.visualMid) *
            midResponse;

        this.material
            .uniforms
            .uMid
            .value =
            this.visualMid;

        const targetVocal =
            (
                (audio?.frequencyBands.mid ?? 0) * 0.6 +
                (audio?.frequencyBands.highMid ?? 0) * 0.4
            );

        const vocalResponse =
            targetVocal > this.vocalResponse
                ? 0.18
                : 0.05;

        this.vocalResponse +=
            (targetVocal - this.vocalResponse) *
            vocalResponse;

        this.material
            .uniforms
            .uVocalIntensity
            .value =
            this.vocalResponse;

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

        const localCorePosition =
            this.mesh.worldToLocal(
                corePosition.clone()
            );

        this.material
            .uniforms
            .uCorePosition
            .value
            .copy(
                localCorePosition
            );
    }
}