import * as THREE from "three";
import type { AnalyzedAudio } from "../../audio/models/AnalyzedAudio.js";

import EffectManager from "./effects/EffectManager.mjs";
import SceneManager from "./rendering/SceneManager.mjs";
import CameraManager from "./rendering/CameraManager.mjs";
import Renderer from "./rendering/Renderer.mjs";

class Visualizer {
    private readonly effectManager: EffectManager;
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

        this.effectManager = new EffectManager();

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

        this.sceneManager.scene.add(light);

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
        const bass =
        this.audio?.frequencyBands.bass ?? 0;

        this.elapsedTime += deltaTime;

        this.effectManager.update(
            this.audio,
            this.elapsedTime
        );

        this.sceneManager.nebula.update(
            this.elapsedTime,
            bass
        );

        this.sceneManager.particleField.update(
            this.elapsedTime
        );



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