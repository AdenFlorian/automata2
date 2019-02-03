import * as BABYLON from 'babylonjs'
// @ts-ignore
import myShader from './myShader.glsl'

class Game {
    private _canvas: HTMLCanvasElement
    private _engine: BABYLON.Engine
    private _scene?: BABYLON.Scene
    private _camera?: BABYLON.FreeCamera
    private _light?: BABYLON.Light
    private myShaderMaterial?: BABYLON.ShaderMaterial

    constructor(canvasElement: string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement
        this._engine = new BABYLON.Engine(this._canvas, true)
    }

    createScene(): void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine)

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -10), this._scene)

        // Target the camera to scene origin.
        this._camera.setTarget(BABYLON.Vector3.Zero())

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false)

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene)

        // Create a built-in "sphere" shape with 16 segments and diameter of 2.
        let myPlane = BABYLON.MeshBuilder.CreatePlane('myPlane',
            {size: 8}, this._scene)

        // Move the sphere upward 1/2 of its height.
        // sphere.position.y = 1

        // Create a built-in "ground" shape.
        let ground = BABYLON.MeshBuilder.CreateGround('ground',
            {width: 6, height: 6, subdivisions: 2}, this._scene)

        ground.position.y = -4

        this.myShaderMaterial = new BABYLON.ShaderMaterial('myShader', this._scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode",
        }, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", 'time']
            });

        this.myShaderMaterial.setFloat('time', 0)

        myPlane.material = this.myShaderMaterial

        var time = 0;
        this._scene.registerBeforeRender(() => {
            this.myShaderMaterial!.setFloat('time', time)
            time += 0.01;
        });
    }

    doRender(): void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene!.render()
        })

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize()
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    const game = new Game('renderCanvas')

    // Create the scene.
    game.createScene()

    // Start render loop.
    game.doRender()
})
