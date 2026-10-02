import * as THREE from "three";

export default class Sun {

    readonly sprite: THREE.Sprite;

    constructor() {

        const texture =
            this.createTexture();

        const material =
            new THREE.SpriteMaterial({

                map: texture,

                transparent: true,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });

        this.sprite =
            new THREE.Sprite(
                material
            );

        this.sprite.position.set(
            -55,
            28,
            -75
        );

        this.sprite.scale.set(
            12,
            12,
            1
        );
    }

    private createTexture():
        THREE.CanvasTexture {

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 256;
        canvas.height = 256;

        const context =
            canvas.getContext("2d")!;

        const gradient =
            context.createRadialGradient(
                128,
                128,
                0,
                128,
                128,
                128
            );

        gradient.addColorStop(
            0.0,
            "rgba(255, 255, 245, 1)"
        );

        gradient.addColorStop(
            0.08,
            "rgba(255, 248, 220, 1)"
        );

        gradient.addColorStop(
            0.18,
            "rgba(255, 220, 150, 0.95)"
        );

        gradient.addColorStop(
            0.35,
            "rgba(255, 170, 70, 0.35)"
        );

        gradient.addColorStop(
            0.55,
            "rgba(255, 120, 30, 0.10)"
        );

        gradient.addColorStop(
            0.75,
            "rgba(255, 80, 10, 0.025)"
        );

        gradient.addColorStop(
            1.0,
            "rgba(255, 50, 0, 0)"
        );

        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            256,
            256
        );

        return new THREE.CanvasTexture(
            canvas
        );
    }
}