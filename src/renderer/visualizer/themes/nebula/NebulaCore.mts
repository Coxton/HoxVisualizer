import * as THREE from "three";

export default class NebulaCore {
    readonly points: THREE.Points;
    readonly innerPoints: THREE.Points;
    private readonly originalPositions: Float32Array;

    constructor(scene: THREE.Scene) {
        const particleCount = 1500;

        const positions = new Float32Array(
            particleCount * 3
        );


            

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            const radius =
                Math.pow(Math.random(), 3) * 1.2;

            const theta =
                Math.random() * Math.PI * 2;

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );

            positions[index] =
                radius *
                Math.sin(phi) *
                Math.cos(theta);

            positions[index + 1] =
                radius *
                Math.sin(phi) *
                Math.sin(theta);

            positions[index + 2] =
                radius *
                Math.cos(phi);
        }

        
        this.originalPositions =
            positions.slice();

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const material =
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.04,
                transparent: true,
                opacity: 0.8
            });

        this.points = new THREE.Points(
            geometry,
            material
        );

        scene.add(this.points);

        const innerCount = 500;

        const innerPositions = new Float32Array(
            innerCount * 3
        );

        for (let i = 0; i < innerCount; i++) {
            const index = i * 3;

            const radius =
                Math.pow(Math.random(), 3) * 0.5;

            const theta =
                Math.random() * Math.PI * 2;

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );

            innerPositions[index] =
                radius *
                Math.sin(phi) *
                Math.cos(theta);

            innerPositions[index + 1] =
                radius *
                Math.sin(phi) *
                Math.sin(theta);

            innerPositions[index + 2] =
                radius *
                Math.cos(phi);
        }

        const innerGeometry =
            new THREE.BufferGeometry();

        innerGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                innerPositions,
                3
            )
        );

        const innerMaterial =
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.07,
                transparent: true,
                opacity: 0.9
            });

        this.innerPoints =
            new THREE.Points(
                innerGeometry,
                innerMaterial
            );

        scene.add(this.innerPoints);
    }

    update(
            elapsedTime: number,
            bass: number
        ): void {
        this.points.rotation.y =
            elapsedTime * 0.05;

        this.innerPoints.rotation.y =
            elapsedTime * 0.08;

        this.innerPoints.rotation.x =
            elapsedTime * 0.03;

        const positionAttribute =
        this.points.geometry.getAttribute(
            "position"
        ) as THREE.BufferAttribute;   

        for (
            let i = 0;
            i < positionAttribute.count;
            i++
        ) {
            const index = i * 3;

            const x =
                this.originalPositions[index];

            const y =
                this.originalPositions[index + 1];

            const z =
                this.originalPositions[index + 2];

            const radius =
                Math.sqrt(
                    x * x +
                    y * y +
                    z * z
                );

            const pulse =
                Math.sin(
                    elapsedTime * 3 +
                    radius * 8
                ) *
                bass *
                0.15;

            positionAttribute.setXYZ(
                i,
                x + x * pulse,
                y + y * pulse,
                z + z * pulse
            );
        }

        positionAttribute.needsUpdate = true;

        console.log("Core bass:", bass);
    }
}