import * as THREE from "three";

export default class SceneManager {

    readonly scene: THREE.Scene;
    readonly sphere: THREE.Mesh;
    readonly sphereGeometry: THREE.SphereGeometry;
    readonly sphereMaterial: THREE.MeshStandardMaterial;

    constructor() {
        this.scene = new THREE.Scene();

        this.sphereGeometry = new THREE.SphereGeometry(
            1,
            64,
            64
        );

        this.sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0
        });

        this.sphere = new THREE.Mesh(
            this.sphereGeometry,
            this.sphereMaterial
        );

        this.scene.add(this.sphere);
    }
}