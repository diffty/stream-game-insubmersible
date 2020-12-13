import * as THREE from './libs/three/build/three.module.js';
import { CONFIG } from '../config.js'

import { EffectComposer } from './libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPassAlpha } from './postprocessing/UnrealBloomPassAlpha.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';

const renderWidth = 1920;
const renderHeight = 1080;


function findPlayerObject(sceneElement, objectName, objectType) {
    var foundObjects = []

    if (sceneElement.children) {
        for (var i in sceneElement.children) {
            var o = sceneElement.children[i];
            foundObjects = foundObjects.concat(findPlayerObject(o, objectName, objectType));
        }
    }

    if (sceneElement.name.search(objectName) >= 0) {
        if (sceneElement.type == objectType) {
            foundObjects.push(sceneElement);
        }
    }

    return foundObjects;
}


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
        this.renderer.setSize( renderWidth, renderHeight );
        this.renderer.setClearColor( 0x000000, 0 ); // the default
        document.body.appendChild( this.renderer.domElement );

        // ******** SHADER SHIT ********
        this.composer = new EffectComposer(this.renderer);

        // Asset loading
        this.playerObjects = [];
        this.alarmLight = null;

        gltfLoader.load(
            "./models/overlay.gltf",
            (gltf) => {
                this.scene.add(gltf.scene);

                this.camera = gltf.cameras[0];
                this.camera.aspect = 1.778;
                this.camera.updateProjectionMatrix();

                this.alarmLight = findPlayerObject(this.scene, "_Alarm", "PointLight")[0];
                this.clockNeedle = findPlayerObject(this.scene, "_Clock", "Mesh")[0];

                for (var i = 0; i < 4; i++) {
                    let lifeLight = findPlayerObject(this.scene, "_Life_P" + (i+1), "SpotLight");
                    let oxyMesh = findPlayerObject(this.scene, "_OxygenMeter_P" + (i+1), "Mesh");

                    // Tweaking Oxygen Bars
                    oxyMesh[0].material.emissive = new THREE.Color(0.0, 0.376085, 1);
                    oxyMesh[0].material.emissiveIntensity = 1.2;

                    this.playerObjects.push({
                        "lifeLight": lifeLight[0],
                        "oxyMesh": oxyMesh[0],
                    });
                }

                this.updateSystem();
                
                this.renderPass = new RenderPass( this.scene, this.camera );
                this.renderPass.clearAlpha = 0;
                
                this.composer.addPass( this.renderPass );
            }
        )

        var bloomPass = new UnrealBloomPassAlpha( new THREE.Vector2( renderWidth, renderHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = 0.0;
        bloomPass.strength = 2.0;
        bloomPass.radius = 1.0;
        this.composer.addPass( bloomPass );
    }

    updateSystem() {
        $.ajax({
            url: `http://${CONFIG.host}:${CONFIG.port}/getSystem`
        }).then((data) => {
            this.gameSystem.receiveSystemUpdate(data)
        });
    }

    update(deltaTime) {
        this.gameSystem.update(deltaTime);

        for (let i in this.gameSystem.players) {
            let p = this.gameSystem.players[i];
            this.playerObjects[i]["lifeLight"].visible = p.isDead ? false : true;

            let oxyBarTargetScale = p.oxygen / this.gameSystem.game.maxOxygen;
            let oxyBarDelta = this.playerObjects[i]["oxyMesh"].scale.y - oxyBarTargetScale;

            if (Math.abs(oxyBarDelta) > 0.01) {
                this.playerObjects[i]["oxyMesh"].scale.y -= oxyBarDelta * deltaTime * 3;
            }
            else {
                this.playerObjects[i]["oxyMesh"].scale.y = oxyBarTargetScale;
            }
        }

        if (this.alarmLight) {
            this.alarmLight.visible = this.gameSystem.game.alarm;
        }

        if (this.clockNeedle) {
            this.clockNeedle.rotation.x = -(this.gameSystem.game.currTime / this.gameSystem.game.maxTime) * 2 * Math.PI;
        }
    }

    draw(deltaTime) {
        //this.renderer.render(scene, camera);
        this.composer.render();
    }
}
