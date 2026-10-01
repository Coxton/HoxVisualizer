import * as THREE from "three";


export default class ShootingStar {

    readonly sprite:
        THREE.Sprite;


    private readonly velocity:
        THREE.Vector3 =
            new THREE.Vector3();


    private startTime = 0;

    private duration = 1;

    private active = false;


    get isActive(): boolean {

        return this.active;
    }


    constructor() {

        const texture =
            this.createTexture();


        const material =
            new THREE.SpriteMaterial({

                map: texture,

                transparent: true,

                opacity: 0,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        this.sprite =
            new THREE.Sprite(
                material
            );


        this.sprite.visible =
            false;


        this.sprite.scale.set(
            5.5,
            1.4,
            1
        );
    }


    launch(time: number): void {

        this.sprite.position.set(

            -45 +
            Math.random() * 90,

            25 +
            Math.random() * 25,

            -70 -
            Math.random() * 20
        );


        const direction =
            new THREE.Vector3(

                0.7 +
                Math.random() * 0.35,

                -0.35 -
                Math.random() * 0.25,

                0
            ).normalize();


        const speed =
            18 +
            Math.random() * 12;


        this.velocity
            .copy(direction)
            .multiplyScalar(speed);


        this.startTime =
            time;


        this.duration =
            1.2 +
            Math.random() * 0.8;


        this.active =
            true;


        this.sprite.visible =
            true;


        this.sprite.material.opacity =
            0;


        this.sprite.material.rotation =
            Math.atan2(
                direction.y,
                direction.x
            );
    }


    update(
        time: number,
        deltaTime: number
    ): void {

        if (!this.active) {
            return;
        }


        const elapsed =
            time -
            this.startTime;


        const progress =
            elapsed /
            this.duration;


        if (
            progress >= 1
        ) {

            this.deactivate();

            return;
        }


        this.sprite.position.addScaledVector(
            this.velocity,
            deltaTime
        );


        const opacity =
            this.calculateOpacity(
                progress
            );


        this.sprite.material.opacity =
            opacity * 0.85;
    }


    private calculateOpacity(
        progress: number
    ): number {

        if (progress < 0.12) {

            return progress / 0.12;
        }


        if (progress > 0.72) {

            return 1 -
                (
                    (progress - 0.72) /
                    0.28
                );
        }


        return 1;
    }


    private deactivate(): void {

        this.active =
            false;

        this.sprite.visible =
            false;

        this.sprite.material.opacity =
            0;
    }


    private createTexture():
        THREE.CanvasTexture {

        const canvas =
            document.createElement("canvas");

        canvas.width = 256;
        canvas.height = 64;


        const context =
            canvas.getContext("2d");

        if (!context) {

            throw new Error(
                "Unable to create shooting star texture."
            );
        }


        const gradient =
            context.createLinearGradient(
                0,
                32,
                256,
                32
            );


        gradient.addColorStop(
            0.0,
            "rgba(255, 255, 255, 0.0)"
        );

        gradient.addColorStop(
            0.55,
            "rgba(255, 255, 255, 0.08)"
        );

        gradient.addColorStop(
            0.82,
            "rgba(255, 255, 255, 0.45)"
        );

        gradient.addColorStop(
            0.96,
            "rgba(255, 255, 255, 0.9)"
        );

        gradient.addColorStop(
            1.0,
            "rgba(255, 255, 255, 1.0)"
        );


        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            24,
            256,
            16
        );


        const coreGradient =
            context.createRadialGradient(
                230,
                32,
                0,
                230,
                32,
                18
            );


        coreGradient.addColorStop(
            0.0,
            "rgba(255, 255, 255, 1.0)"
        );

        coreGradient.addColorStop(
            0.35,
            "rgba(255, 250, 230, 0.9)"
        );

        coreGradient.addColorStop(
            1.0,
            "rgba(255, 220, 160, 0.0)"
        );


        context.fillStyle =
            coreGradient;

        context.fillRect(
            210,
            12,
            40,
            40
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