import * as THREE from "three";

export default class CameraManager {

    readonly camera: THREE.PerspectiveCamera;

    constructor() {

        //setup scene camera
        //TODO:: Cinematic Camera Motion -> Toggleable later on
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.z = 5;
    }

    resize(): void {
        this.camera.aspect =
            window.innerWidth / window.innerHeight;

        this.camera.updateProjectionMatrix();
    }
}