import * as THREE from "three";

import vertexShader
    from "./shaders/nebulaCore.vert.glsl?raw";

import fragmentShader
    from "./shaders/nebulaCore.frag.glsl?raw";

export default class NebulaCore {

    readonly mesh: THREE.Mesh;

    private readonly material: THREE.ShaderMaterial;


    constructor(scene: THREE.Scene) {

        const geometry =
        new THREE.BoxGeometry(
            2,
            2,
            2
        )


        this.material =
            new THREE.ShaderMaterial({

                uniforms: {

                    uCameraPosition: {
                        value:
                            new THREE.Vector3()
                    },

                    uCoreColor: {
                        value: new THREE.Color(
                            1.0,
                            0.12,
                            0.0
                        )
                    },
                    uGlowColor: {
                        value: new THREE.Color(
                            1.0,
                            0.85,
                            0.15
                        )
                    },

                    uIntensity: {
                        value: 1.0
                    }

                },

                vertexShader,
                fragmentShader,

                transparent: true,

                depthWrite: false,

                side: THREE.BackSide,

                blending: THREE.NormalBlending

            });


        this.mesh =
            new THREE.Mesh(
                geometry,
                this.material
            );

 


        scene.add(this.mesh);
    }


        update(
            camera: THREE.Camera
        ): void {

            const localCameraPosition =
                this.mesh.worldToLocal(
                    camera.position.clone()
                );

            this.material.uniforms.uCameraPosition
                .value.copy(
                    localCameraPosition
                );
        }
}