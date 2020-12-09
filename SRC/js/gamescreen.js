import * as THREE from './libs/three/build/three.module.js';

import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPassAlpha } from './postprocessing/UnrealBloomPassAlpha.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';

const renderWidth = 1920;
const renderHeight = 1080;


export class GameScreen {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;

        // LOADING TEXTURES
        var texloader = new THREE.TextureLoader();
        var clock = new THREE.Clock();
        var gltfLoader = new GLTFLoader();

        // SCENE & CAM
        this.scene = new THREE.Scene();

        this.camera = null;

        // RENDERER
        this.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
        this.renderer.setSize( renderHeight, renderHeight );
        this.renderer.setClearColor( 0x000000, 0 ); // the default
        document.body.appendChild( this.renderer.domElement );


        // ******** SHADER SHIT ********
        this.composer = new EffectComposer(this.renderer);

        gltfLoader.load(
            "./models/overlay.gltf",
            (gltf) => {
                this.scene.add(gltf.scene);

                this.camera = gltf.cameras[0];

                this.renderPass = new RenderPass( this.scene, this.camera );
                this.renderPass.clearAlpha = 0;
                
                this.composer.addPass( this.renderPass );
            }
        )

        var bloomPass = new UnrealBloomPassAlpha( new THREE.Vector2( renderWidth, renderHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = 0.0;
        bloomPass.strength = 2.0;
        bloomPass.radius = 1.0;
        //this.composer.addPass( bloomPass );
    }

    update(deltaTime) {

    }

    draw(deltaTime) {
        //this.renderer.render(scene, camera);
        this.composer.render();
    }
}
