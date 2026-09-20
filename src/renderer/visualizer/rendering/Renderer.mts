import * as THREE from "three";

export default class Renderer {

    readonly renderer: THREE.WebGLRenderer;

    constructor() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        //set the size of the rendered scene
        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        //attach the renderer to the DOM Element 
        document.body.appendChild(
            this.renderer.domElement
        );
    }

    render(
        scene: THREE.Scene,
        camera: THREE.Camera
    ): void {
        this.renderer.render(
            scene,
            camera
        );
    }

    resize(): void {
        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
}