import * as THREE from "three";

export default class Renderer {

    readonly renderer:
        THREE.WebGLRenderer;

    private gasRenderTarget:
        THREE.WebGLRenderTarget;

    private mainRenderTarget:
        THREE.WebGLRenderTarget;

    private readonly compositeScene:
        THREE.Scene;

    private readonly compositeCamera:
        THREE.OrthographicCamera;

    private readonly compositeMesh:
        THREE.Mesh;

    private readonly gasMaterial:
        THREE.ShaderMaterial;

    private readonly gasResolutionScale =
        0.5;

    constructor() {

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });

        this.renderer.autoClear = false;

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        document.body.appendChild(
            this.renderer.domElement
        );

        this.gasRenderTarget =
            this.createGasRenderTarget();

        this.mainRenderTarget =
            new THREE.WebGLRenderTarget(
                window.innerWidth,
                window.innerHeight,
                {
                    depthBuffer: false,
                    stencilBuffer: false,
                    format: THREE.RGBAFormat
                }
            );

        this.compositeScene =
            new THREE.Scene();

        this.compositeCamera =
            new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0,
                1
            );

        const geometry =
            new THREE.PlaneGeometry(
                2,
                2
            );

        this.gasMaterial =
            new THREE.ShaderMaterial({

                uniforms: {
                    uMainTexture: {
                        value:
                            this.mainRenderTarget.texture
                    },

                    uGasTexture: {
                        value:
                            this.gasRenderTarget.texture
                    }
                },

                vertexShader: `
                    varying vec2 vUv;

                    void main()
                    {
                        vUv = uv;

                        gl_Position =
                            vec4(
                                position,
                                1.0
                            );
                    }
                `,

                fragmentShader: `
                    uniform sampler2D uMainTexture;
                    uniform sampler2D uGasTexture;

                    varying vec2 vUv;

                    void main()
                    {
                        vec4 scene =
                            texture2D(
                                uMainTexture,
                                vUv
                            );

                        vec4 gas =
                            texture2D(
                                uGasTexture,
                                vUv
                            );

                        vec3 color =
                            gas.rgb +
                            scene.rgb *
                            (1.0 - gas.a);

                        gl_FragColor =
                            vec4(
                                color,
                                1.0
                            );
                    }
                `,

                transparent: false,

                depthWrite: false,

                depthTest: false
            });

        this.compositeMesh =
            new THREE.Mesh(
                geometry,
                this.gasMaterial
            );

        this.compositeScene.add(
            this.compositeMesh
        );
    }

    renderGas(
        scene: THREE.Scene,
        camera: THREE.Camera
    ): void {

        this.renderer.setRenderTarget(
            this.gasRenderTarget
        );

        this.renderer.setClearColor(
            0x000000,
            0
        );

        this.renderer.clear();

        this.renderer.render(
            scene,
            camera
        );
    }

    renderMain(
        scene: THREE.Scene,
        camera: THREE.Camera
    ): void {

        this.renderer.setRenderTarget(
            this.mainRenderTarget
        );

        this.renderer.setClearColor(
            0x000000,
            1
        );

        this.renderer.clear();

        this.renderer.render(
            scene,
            camera
        );
    }

    renderGasComposite(): void {

        this.renderer.setRenderTarget(
            null
        );

        this.renderer.clear();

        this.renderer.render(
            this.compositeScene,
            this.compositeCamera
        );
    }

    resize(): void {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;

        this.renderer.setSize(
            width,
            height
        );

        this.mainRenderTarget.setSize(
            width,
            height
        );

        this.gasRenderTarget.setSize(
            Math.max(
                1,
                Math.floor(
                    width *
                    this.gasResolutionScale
                )
            ),
            Math.max(
                1,
                Math.floor(
                    height *
                    this.gasResolutionScale
                )
            )
        );
    }

    private createGasRenderTarget():
        THREE.WebGLRenderTarget {

        const width =
            Math.max(
                1,
                Math.floor(
                    window.innerWidth *
                    this.gasResolutionScale
                )
            );

        const height =
            Math.max(
                1,
                Math.floor(
                    window.innerHeight *
                    this.gasResolutionScale
                )
            );

        return new THREE.WebGLRenderTarget(
            width,
            height,
            {
                depthBuffer: false,
                stencilBuffer: false,
                format: THREE.RGBAFormat
            }
        );
    }
}