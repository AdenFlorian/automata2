import {
    PerspectiveCamera, Scene, WebGLRenderer,
    Mesh, Fog, Object3D, SphereBufferGeometry, MeshPhongMaterial, AmbientLight, DirectionalLight, Camera
} from 'three';
// import myShader from './testShader.glsl'
// import './app.css'
import {EffectComposer, RenderPass, ShaderPass} from './three/postprocessing'
import {DotScreenShader, RGBShiftShader} from './three/shaders'

let camera: PerspectiveCamera
let scene: Scene
let renderer: WebGLRenderer
let composer: THREE.EffectComposer
let object: Object3D
let light: DirectionalLight

init();
animate();

function init() {

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new Scene();
    scene.fog = new Fog(0x000000, 1, 1000);

    object = new Object3D();
    scene.add(object);

    let geometry = new SphereBufferGeometry(1, 4, 4);
    let material = new MeshPhongMaterial({color: 0xffffff, flatShading: true});

    for (let i = 0; i < 100; i++) {

        let mesh = new Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 400);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        object.add(mesh);

    }

    scene.add(new AmbientLight(0x222222));

    light = new DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    // postprocessing

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    console.log('aaaa: ', DotScreenShader)

    const effect = new ShaderPass(DotScreenShader);
    console.log('aaaa: ', effect)
    effect.uniforms = {
        scale: {
            value: 4
        }
    }
    composer.addPass(effect);

    const effect2 = new ShaderPass(RGBShiftShader);
    // effect2.uniforms = {
    //     amount: {
    //         value: 0.0015
    //     }
    // }
    effect2.renderToScreen = true;
    composer.addPass(effect2);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    object.rotation.x += 0.005;
    object.rotation.y += 0.01;

    composer.render();

}
