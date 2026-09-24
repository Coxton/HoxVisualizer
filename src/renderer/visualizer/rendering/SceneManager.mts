import * as THREE from "three";

import StarField from "../environment/StarField.mjs";
import Nebula from "../themes/nebula/Nebula.mjs";

export default class SceneManager {

    readonly scene: THREE.Scene;
    readonly gasScene: THREE.Scene;

    readonly starField: StarField;
    readonly nebula: Nebula;

    constructor() {

        this.scene =
            new THREE.Scene();

        this.gasScene =
            new THREE.Scene();

        this.starField =
            new StarField(
                this.scene
            );

        this.nebula =
            new Nebula(
                this.scene,
                this.gasScene
            );
    }
}