// @ts-types="@types/three"
import { Group, Mesh, Scene } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import RAPIER from "@dimforge/rapier3d";
import Resources from "../utils/Resources.ts";
import Time from "../utils/Time.ts";
import Game from "../Game.ts";
import DraggableMesh from "./DraggableMesh.ts";

export default class FoxBlock extends DraggableMesh {
  game: Game;
  scene: Scene;
  resources: Resources;
  time: Time;
  model: GLTF;
  key: number;
  mesh: Mesh | Group;
  body: RAPIER.RigidBody;

  constructor(game: Game) {
    super();
    this.game = game;
    this.scene = this.game.world.scene;
    this.resources = this.game.resources;
    this.time = this.game.time;
  
    this.model = this.resources.items.foxModel as GLTF;
    this.mesh = this.setupMesh();;
    
    const { key, body } = this.createFoxBlock();
    this.body = body;
    this.key = key;
  }

  setupMesh = () => {
    this.mesh = this.model.scene;
    this.mesh.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.mesh);

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });

    return this.mesh;
  };


  createFoxBlock = () => {
    const entity = this.game.physics.addEntity(this.mesh, {
      // type: 'dynamic',
      type: 'fixed',
      position: { x: 0, y: 0.5, z: 0 },
      collider: {
        shape: 'cuboid',
        parameters: [0.5, 0.5, 0.5],
      }
    });

    return entity;
  };
}

