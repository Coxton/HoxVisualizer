import * as THREE from "three";


export default class Sun {

    readonly sprite:
        THREE.Sprite;


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
            18,
            18,
            1
        );
    }


    private createTexture():
        THREE.CanvasTexture {

        const canvas =
            document.createElement("canvas");

        canvas.width = 256;
        canvas.height = 256;


        const context =
            canvas.getContext("2d");

        if (!context) {

            throw new Error(
                "Unable to create Sun texture."
            );
        }


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
            "rgba(255, 255, 245, 1.0)"
        );

        gradient.addColorStop(
            0.12,
            "rgba(255, 250, 220, 1.0)"
        );

        gradient.addColorStop(
            0.30,
            "rgba(255, 220, 130, 0.75)"
        );

        gradient.addColorStop(
            0.55,
            "rgba(255, 180, 70, 0.25)"
        );

        gradient.addColorStop(
            1.0,
            "rgba(255, 140, 40, 0.0)"
        );


        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            256,
            256
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        texture.colorSpace =
            THREE.SRGBColorSpace;


        return texture;
    }
}