// @ts-types="@types/three"
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import Game from "../Game.ts";
import DraggableMesh from "./DraggableMesh.ts";

export default class Cube extends DraggableMesh {
  game: Game;

  constructor(game: Game) {
    super();
    this.game = game;

    const { key, mesh, body } = this.createCube();
    this.mesh = mesh;
    this.body = body;
    this.key = key;

    this.setupDraggable();
  }

  createCube = () => {
    // add debug physics cube
    const cubeMesh = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({
        color: '#ffeeee',
        transparent: true,
      }),
    );

    const cubeEntity = this.game.physics.addEntity(cubeMesh, {
      type: 'dynamic',
      position: { x: 0, y: 4, z: 0 },
      collider: {
        shape: 'cuboid',
        parameters: [0.5, 0.5, 0.5],
      }
    });

    return cubeEntity;
  };
}
