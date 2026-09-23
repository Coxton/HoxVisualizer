import * as THREE from "three";
import StarField from "../environment/StarField.mjs";
import Nebula from "../themes/nebula/Nebula.mjs";

export default class SceneManager {


    readonly scene: THREE.Scene;
    readonly starField: StarField;
    readonly nebula: Nebula;

    constructor() {
        //declare threejs scene
        this.scene = new THREE.Scene();

        //include starry background
        this.starField = new StarField(
            this.scene
        );

        //render Nebula
        this.nebula = new Nebula(this.scene);
        
    }
}