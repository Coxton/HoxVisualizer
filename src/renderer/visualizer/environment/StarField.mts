import * as THREE from "three";

import StarLayer from "./StarLayer.mjs";
import Sun from "./Sun.mjs";
import ShootingStar from "./ShootingStar.mjs";


export default class StarField {

    readonly points: THREE.Group;

    private readonly starLayers:
        StarLayer[] = [];

    private readonly sun:
        Sun;

    private readonly shootingStars:
        ShootingStar[] = [];

    private nextShootingStarTime =
        5;


    constructor(scene: THREE.Scene) {

        this.points =
            new THREE.Group();

        scene.add(this.points);


        this.createStarLayers();


        this.sun =
            new Sun();

        this.points.add(
            this.sun.sprite
        );


        this.createShootingStars();
    }


    update(
        time: number,
        deltaTime: number
    ): void {

        for (
            const layer
            of this.starLayers
        ) {

            layer.update(time);
        }


        this.updateShootingStars(
            time,
            deltaTime
        );
    }


    private createStarLayers(): void {

        this.addStarLayer(
            2200,
            0.12,
            0.45
        );

        this.addStarLayer(
            450,
            0.18,
            0.65
        );

        this.addStarLayer(
            60,
            0.25,
            0.9
        );
    }


    private addStarLayer(
        particleCount: number,
        size: number,
        opacity: number
    ): void {

        const layer =
            new StarLayer(
                particleCount,
                size,
                opacity
            );

        this.starLayers.push(
            layer
        );

        this.points.add(
            layer.points
        );
    }


    private createShootingStars(): void {

        const count = 3;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const shootingStar =
                new ShootingStar();

            this.shootingStars.push(
                shootingStar
            );

            this.points.add(
                shootingStar.sprite
            );
        }


        this.nextShootingStarTime =
            5 +
            Math.random() * 10;
    }


    private updateShootingStars(
        time: number,
        deltaTime: number
    ): void {

        for (
            const shootingStar
            of this.shootingStars
        ) {

            shootingStar.update(
                time,
                deltaTime
            );
        }


        if (
            time <
            this.nextShootingStarTime
        ) {
            return;
        }


        const availableStar =
            this.shootingStars.find(
                star =>
                    !star.isActive
            );


        if (availableStar) {

            availableStar.launch(
                time
            );
        }


        this.nextShootingStarTime =
            time +
            5 +
            Math.random() * 12;
    }
}