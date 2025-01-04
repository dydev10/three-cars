// @ts-types="@types/three"
import { Group, Mesh } from "three";
import { PhysicsEntity } from "../../engine/Physics.ts";
import IDraggable from "../../engine/world/IDraggable.ts";
import { GridXY } from "./LevelGrid.ts";
import Game from "../../engine/Game.ts";
import { tileToDeg } from "../../engine/helpers/rotation.ts";


export default class GridAsset implements IDraggable {
  game: Game;
  gridXY: GridXY;
  key?: number;
  isDragging: boolean;
  draggable: boolean;
  entity: PhysicsEntity;
  rotation: number;
  type: string;

  constructor(game: Game, asset: Mesh | Group, rotation: number = 0, type: string = 'default') {
    this.game = game;
    this.gridXY = { x: 0, y: 0 };
    this.key = 0;
    this.isDragging = false;
    this.draggable = false; // turn this on when drag ready
    
    
    this.rotation = rotation;
    this.type = type;
    asset.rotation.set(0, tileToDeg(this.rotation), 0);
    this.entity = this.createGridEntity(asset);
  }

  startDrag = () => {
    //TODO:
  };

  stopDrag = () => {
    //TODO:
  };

  drag = () => {
    //TODO:
  };

  clone = (rotation: number): GridAsset => {
    return new GridAsset(this.game, this.entity.mesh.clone(true), rotation, this.type);
  };

  createGridEntity = (asset: Mesh | Group) => {
    const entity = this.game.physics.addEntity(asset, {
      type: 'fixed',
      position: { x: 0, y: 0.5, z: 0 },
      collider: {
        shape: 'cuboid',
        parameters: [0.5, 0.5, 0.5],
      }
    });

    return entity;
  };

  addToGrid = (gridXY: GridXY) => {
    this.game.world.scene.add(this.entity.mesh);
    this.entity.body.setTranslation({
      x: gridXY.x ?? 0,
      y: this.entity.body.translation().y,
      z: gridXY.y ?? 0
    }, true);
  };

  removeFromGrid = () => {
    this.game.world.scene.remove(this.entity.mesh);
    this.game.physics.removeEntityByKey(this.entity.key);
  };
}
