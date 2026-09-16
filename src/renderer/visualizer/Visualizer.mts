import * as THREE from "three";
import type { AnalyzedAudio } from "../../audio/models/AnalyzedAudio.js";

import SphereDeformation from "./effects/SphereDeformation.mjs";
import SceneManager from "./rendering/SceneManager.mjs";
import CameraManager from "./rendering/CameraManager.mjs";
import Renderer from "./rendering/Renderer.mjs";

class Visualizer {
    private readonly sphereDeformation: SphereDeformation;
    private readonly sceneManager: SceneManager;
    private readonly cameraManager: CameraManager;
    private readonly renderer: Renderer;
    
    //Declare Properties of Three js scene
    private elapsedTime = 0;

    //Audio Feed
    private audio: AnalyzedAudio | null = null;


    private readonly timer: THREE.Timer;



    constructor() {
        this.timer = new THREE.Timer();

        this.sceneManager = new SceneManager();

        this.sphereDeformation = new SphereDeformation(
            this.sceneManager.sphereGeometry
        );

        this.cameraManager = new CameraManager();


        //add Light
        const light = new THREE.PointLight(
            0xffffff,
            2
        );

        light.position.set(
            2,
            2,
            4
        );

        this.setupEventListeners();

        this.renderer = new Renderer();

    }

    //Render the Scene
    start(): void {
        this.render();
    }

 
    private render(): void {
        this.timer.update();

        const deltaTime = this.timer.getDelta();

        this.elapsedTime += deltaTime;

        this.sphereDeformation.apply(
            this.audio,
            this.elapsedTime
        );

        const mid = this.audio?.frequencyBands.mid ?? 0;
        const treble = this.audio?.frequencyBands.treble ?? 0;

        this.sceneManager.sphereMaterial.emissiveIntensity = treble;

        const rotationSpeed = 0.3 + mid * 1.2;

        this.sceneManager.sphere.rotation.x += rotationSpeed * deltaTime;
        this.sceneManager.sphere.rotation.y += rotationSpeed * deltaTime;


        this.renderer.render(
            this.sceneManager.scene,
            this.cameraManager.camera
        );

        requestAnimationFrame(() => this.render());
    }

    update(audio: AnalyzedAudio): void {
        this.audio = audio;
    }

    private setupEventListeners(): void {
    window.addEventListener("resize", () => {
        this.cameraManager.resize();
        this.renderer.resize();
    });
}

}

export default Visualizer;