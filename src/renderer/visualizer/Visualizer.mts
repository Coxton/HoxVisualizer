import * as THREE from "three";
import type { AnalyzedAudio } from "../../audio/models/AnalyzedAudio.js";

import EffectManager from "./effects/EffectManager.mjs";
import SceneManager from "./rendering/SceneManager.mjs";
import CameraManager from "./rendering/CameraManager.mjs";
import Renderer from "./rendering/Renderer.mjs";

class Visualizer {
    //declare managers and renderer
    private readonly effectManager: EffectManager;
    private readonly sceneManager: SceneManager;
    private readonly cameraManager: CameraManager;
    private readonly renderer: Renderer;
    

    private elapsedTime = 0;

    //Receive analyzed Audio
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

    //setup scene to render
    private render(): void {
        this.timer.update();

        const deltaTime = this.timer.getDelta();

        this.elapsedTime += deltaTime;

        this.effectManager.update(
            this.audio,
            this.elapsedTime
        );

        this.sceneManager.nebula.update(
            this.elapsedTime,
            this.audio,
            this.cameraManager.camera
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

    //Listen for Events
    private setupEventListeners(): void {
        //Resize Visualizer Scene upon resizing the Electron Window
        window.addEventListener("resize", () => {
            this.cameraManager.resize();
            this.renderer.resize();
        });
}

}

export default Visualizer;