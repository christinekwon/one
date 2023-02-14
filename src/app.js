/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Raycaster } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MainScene } from 'scenes';
import Images from './components/images/Images';

let images = new Images();

let current_img = images.getImage();

// Initialize core ThreeJS components
const scene = new MainScene(current_img);
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
const renderer = new WebGLRenderer({ antialias: true });

const width = window.innerWidth || 2;
const height = window.innerHeight || 2;

let mouse = {
    x: 0,
    y: 0
};

function onMouseMove(event) {
    event.preventDefault();
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const raycaster = new Raycaster();
let intersects = 0;

function render() {
    raycaster.setFromCamera(mouse, camera);
    if (scene.mesh) {
        intersects = raycaster.intersectObject(scene.mesh);
        if (intersects.length > 0) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'default';
        }
    }

}


// Set up camera
camera.position.set(0, 0, 300);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    // effect.render(scene, camera);
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    render();
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    // effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);

// function onMouseDown(event) {
//     console.log('here')
//     event.preventDefault();
//     if (intersects.length > 0) {
//         document.body.style.cursor = 'grabbing';
//     }
// }


// shuffle button

// const button = document.getElementById("button");
// button.addEventListener("click", shuffleImage);

function shuffleImage(e) {
    let new_img = images.getImage();
    while (new_img == current_img) {
        new_img = images.getImage();
    }
    current_img = new_img;
    scene.changeImage(current_img);
}