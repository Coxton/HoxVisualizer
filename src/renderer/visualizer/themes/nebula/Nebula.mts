import * as THREE from "three";
import NebulaGas from "./NebulaGas.mjs";
import NebulaCore from "./NebulaCore.mjs";
import type { AnalyzedAudio } from "../../../../audio/models/AnalyzedAudio.js";

export default class Nebula {
    readonly gas: NebulaGas;
    readonly core: NebulaCore;
    


    constructor(scene: THREE.Scene) {


        this.gas = new NebulaGas(scene);
        this.core = new NebulaCore(scene);
    }

    update(
        elapsedTime: number,
        audio: AnalyzedAudio | null,
        camera: THREE.Camera
    ): void {
        
        this.core.update(
            elapsedTime,
            audio,
            camera
        );

        this.gas.update(
            elapsedTime,
            audio,
            camera,
            this.core.mesh.position
        );
    }
}