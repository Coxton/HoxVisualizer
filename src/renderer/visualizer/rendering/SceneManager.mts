import * as THREE from "three";
import ParticleField from "../environment/ParticleField.mjs";
import Nebula from "../themes/nebula/Nebula.mjs";

export default class SceneManager {

    readonly scene: THREE.Scene;
    readonly particleField: ParticleField;
    readonly nebula: Nebula;

    constructor() {
        this.scene = new THREE.Scene();

        this.particleField = new ParticleField(
            this.scene
        );

        this.nebula = new Nebula(this.scene);
        
    }
}