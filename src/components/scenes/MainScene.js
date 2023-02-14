import * as Dat from 'dat.gui';
import { Fog, Scene, Color, Group, PlaneGeometry, MeshLambertMaterial, MeshPhongMaterial, Mesh } from 'three';
import { Heart } from 'objects';
import { BasicLights } from 'lights';
// import Images from 'images';

class MainScene extends Scene {
    constructor(images) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

        const bg_top = new Color('aliceblue');
        const bg_bot = new Color(0xaf91bd);

        this.background = new Color('pink');

        this.fog = new Fog(bg_top, 10, 50);

        // const mesh = new Mesh(new PlaneGeometry(2000, 2000), new MeshPhongMaterial({ color: bg_bot, depthWrite: false }));
        // mesh.rotation.x = -Math.PI / 2;
        // mesh.position.y = -5;
        // mesh.receiveShadow = true;
        // this.add(mesh);



        const top = 0.5;
        const bot = -1.5;
        const left = -1;
        const right = 1;

        let tv = new Heart(this, images, 0, 0, 0);

        const lights = new BasicLights();
        this.add(tv, lights);
        this.tv = tv;

        this.changeImage.bind(this.changeImage);
        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }


    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    changeImage(img) {
        this.tv.changeImage(img);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default MainScene;