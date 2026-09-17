import * as THREE from "three";

export default class ParticleField {

    readonly points: THREE.Points;

    constructor(scene: THREE.Scene) {
        const particleCount = 2000;

        const positions = new Float32Array(
            particleCount * 3
        );

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            positions[index] =
                (Math.random() - 0.5) * 40;

            positions[index + 1] =
                (Math.random() - 0.5) * 40;

            positions[index + 2] =
                (Math.random() - 0.5) * 40;
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const starTexture =
            this.createStarTexture();

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            map: starTexture,
            transparent: true,
            alphaTest: 0.01,
            depthWrite: false
        });

        this.points = new THREE.Points(
            geometry,
            material
        );

        scene.add(this.points);
    }

    update(elapsedTime: number): void {
        this.points.rotation.y =
            elapsedTime * 0.01;

        this.points.rotation.x =
            elapsedTime * 0.003;
    }

    private createStarTexture(): THREE.CanvasTexture {
        const canvas =
            document.createElement("canvas");

        canvas.width = 64;
        canvas.height = 64;

        const context =
            canvas.getContext("2d");

        if (!context) {
            throw new Error(
                "Could not create star texture context."
            );
        }

        const gradient =
            context.createRadialGradient(
                32,
                32,
                0,
                32,
                32,
                32
            );

        gradient.addColorStop(
            0,
            "rgba(255, 255, 255, 1)"
        );

        gradient.addColorStop(
            0.15,
            "rgba(255, 255, 255, 0.9)"
        );

        gradient.addColorStop(
            0.45,
            "rgba(255, 255, 255, 0.35)"
        );

        gradient.addColorStop(
            1,
            "rgba(255, 255, 255, 0)"
        );

        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            64,
            64
        );

        return new THREE.CanvasTexture(
            canvas
        );
    }
}