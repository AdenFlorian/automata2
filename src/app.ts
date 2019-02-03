import {
    PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry,
    MeshNormalMaterial, Mesh, ShaderMaterial, Clock
} from 'three';
import myShader from './testShader.glsl'
import './app.css'
import {EffectComposer, RenderPass, ShaderPass, DotScreenShader, RGBShiftShader} from 'postprocessing'

console.log('hello world 2')

let camera: PerspectiveCamera
let scene: Scene
let renderer: WebGLRenderer
let geometry: BoxGeometry
let material: MeshNormalMaterial
let mesh: Mesh
let clock: Clock

const uniforms = {
    // fogDensity: {value: 0.45},
    // fogColor: {value: new THREE.Vector3(0, 0, 0)},
    time: {value: 1.0},
    // canvasSize: {x: 0, y: 0}
    // uvScale: {value: new THREE.Vector2(3.0, 1.0)},
    // texture1: {value: textureLoader.load('textures/lava/cloud.png')},
    // texture2: {value: textureLoader.load('textures/lava/lavatile.jpg')}
};

init();
animate();

function init() {

    renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new Clock();

    camera = new PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new Scene();

    geometry = new BoxGeometry(0.2, 0.2, 0.2);
    // material = new ShaderMaterial();

    // uniforms.canvasSize.x = renderer.getSize().width
    // uniforms.canvasSize.y = renderer.getSize().height

    var postMaterial = new ShaderMaterial({
        // vertexShader: document.querySelector('#post-vert').textContent.trim(),
        fragmentShader: myShader,
        uniforms
        // uniforms: {
        //     cameraNear: {value: camera.near},
        //     cameraFar: {value: camera.far},
        //     tDiffuse: {value: target.texture},
        //     tDepth: {value: target.depthTexture}
        // }
    });

    mesh = new Mesh(geometry, postMaterial);
    scene.add(mesh);

    // postprocessing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    var dotScreenEffect = new ShaderPass(DotScreenShader);
    dotScreenEffect.uniforms['scale'].value = 4;
    composer.addPass(dotScreenEffect);

    var rgbEffect = new ShaderPass(RGBShiftShader);
    rgbEffect.uniforms['amount'].value = 0.0015;
    rgbEffect.renderToScreen = true;
    composer.addPass(rgbEffect);

}

function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    var delta = clock.getDelta();

    uniforms.time.value += delta;

    renderer.render(scene, camera);

}
