// @ts-types="@types/three"
import { AnimationAction, AnimationMixer, Group, Mesh, Scene } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Resources from "../utils/Resources.ts";
import Time from "../utils/Time.ts";
import Game from "../Game.ts";

export default class Fox {
  game: Game;
  scene: Scene;
  resources: Resources;
  time: Time;
  gltf: GLTF;
  model: Group;
  animation: { mixer: AnimationMixer, action: AnimationAction };

  constructor() {
    this.game = Game.Instance;
    this.scene = this.game.world.scene;
    this.resources = this.game.resources;
    this.time = this.game.time;
  
    this.gltf = this.resources.items.foxModel as GLTF;
  
    this.model = this.setupModel();
    this.animation = this.setupAnimation();
  }

  setupModel = () => {
    this.model = this.gltf.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });

    return this.model;
  };

  setupAnimation = () => {
    this.animation = {};
    this.animation.mixer = new AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(this.gltf.animations[0]);
    this.animation.action.play();

    return this.animation;
  };

  update = () => {    
    this.animation.mixer.update(this.time.delta);
  };
}

