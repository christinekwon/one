import { CubeRefractionMapping, Group } from 'three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './heart1.obj';

import TEST_IMG from './img/favicon.png';

import POSX from "./textures/Skybox/posx.jpg";
import NEGX from "./textures/Skybox/negx.jpg";
import POSY from "./textures/Skybox/posy.jpg";
import NEGY from "./textures/Skybox/negy.jpg";
import POSZ from "./textures/Skybox/posz.jpg";
import NEGZ from "./textures/Skybox/negz.jpg";

class Heart extends Group {
    constructor(parent, img, x, y, z) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        let textureLoader = new THREE.TextureLoader();
        // Load object
        const objLoader = new OBJLoader();
        var mesh;


        // const test_img = textureLoader.load(img);



        const test_img = textureLoader.load(img, function(tx) {
            tx.wrapS = THREE.RepeatWrapping;
            tx.wrapT = THREE.RepeatWrapping;
            tx.offset.set(0, 0.08);
            tx.repeat.set(2, 2);
            tx.needsUpdate = true;
            // tx.rotation.set(Math.PI / 32);
            // tx.flipY = false;
            // material.map = tx;

        })

        var envMap = new THREE.CubeTextureLoader()
            .load([
                POSX, NEGX,
                POSY, NEGY,
                POSZ, NEGZ
            ]);


        // let material = new THREE.MeshStandardMaterial({
        //     map: test_img,
        //     envMap: envMap,
        //     envMapIntensity: 0.0,
        //     wireframe: false,
        //     metalness: 0.9,
        //     roughness: 0.0,
        //     // specular: 0xffffff,
        //     // shininess: 10,
        // });

        let material = new THREE.MeshPhongMaterial({
            map: test_img,
            specular: 0xffffff,
            shininess: 100,
            // specularMap: envMap
            // envMap: envMap,
            // reflectivity: 0.3
        });

        objLoader.load(MODEL, obj => {
            var child0 = obj.children[0];



            // let material = new THREE.MeshStandardMaterial({
            //     map: test_img,
            //     // normalMap: screen_normal,
            //     // roughnessMap: screen_roughness,
            //     // roughness: 1,
            //     // aoMap: screen_ao,
            //     // metalness: 0
            // })
            mesh = new THREE.Mesh(child0.geometry);
            mesh.scale.multiplyScalar(10);
            mesh.rotation.set(0, Math.PI / 16, 0);
            mesh.material = material;
            this.mesh = mesh;

            // mesh1 = new THREE.Mesh(child1.geometry);
            // mesh1.scale.multiplyScalar(2);
            // mesh1.rotation.set(0, Math.PI/2, 0);
            // mesh1.material = material;


            // let textureLoader = new THREE.TextureLoader();
            // textureLoader.load(texture, function(tx) {
            //     tx.wrapS = THREE.RepeatWrapping;
            //     tx.wrapT = THREE.RepeatWrapping;
            //     tx.offset.set(0, -0.3);
            // 	tx.repeat.set(3,3);
            //     tx.flipY = false;
            // 	let material = new THREE.MeshPhongMaterial({
            // 		map: tx,
            // 		wireframe: false,
            // 		specular: 0xffffff,
            // 		shininess: 10,
            // 	});
            // mesh.material = material;
            // 	// obj.children[0].material = stripeMaterial;
            // })

            var pivot = new THREE.Group();
            pivot.position.set(x, y, z);
            mesh.position.set(x, y, z)

            this.add(pivot);
            this.add(mesh);
            parent.mesh = mesh;

            this.pivot = pivot;

            this.mesh = mesh;
            this.pivot.add(this.mesh);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.changeImage.bind(this.changeImage);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    changeImage(img) {
        console.log(this.mesh.material[1].map.image);
        this.mesh.material[1].needsUpdate = true;

        this.mesh.material[1].map = new THREE.TextureLoader().load(img);
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animationanimation-iteration-count: 2;

        jumpUp.start();
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.01 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Heart;