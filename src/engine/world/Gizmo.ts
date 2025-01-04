// @ts-types="@types/three"
import { Intersection } from "three";
import Inputs, { InputActionEvent } from "../utils/Inputs.ts";
import RaycastPointer from "../utils/RaycastPointer.ts";
import Game from "../Game.ts";
import IDraggable from "./IDraggable.ts";
import { DragUserData } from "./DraggableMesh.ts";

export default class Gizmo {
  game: Game;
  inputs: Inputs;
  pointer: RaycastPointer;
  transforms: Array<IDraggable>;
  active: IDraggable | null;

  constructor(game: Game, transforms: Array<IDraggable>) {
    this.game = game;
    this.inputs = game.inputs;
    this.pointer = game.pointer;
    this.transforms = transforms;
    this.active = null;

    // @ts-expect-error never
    this.game.time.addEventListener('tick', this.update);

    // @ts-expect-error never
    this.inputs.addEventListener('click', this.pointerClick);
    // @ts-expect-error never
    this.inputs.addEventListener('altClick', this.pointerAltClick);
  }

  pointerClick = (event: InputActionEvent) => {
    if (event.message.start) {
      if (this.active) {
        this.dragEnd();
        return;
      }
      this.dragStart();
    }
  };

  pointerAltClick = (event: InputActionEvent) => {
    if (event.message.start) {
      this.dragEnd(true);
    }
  };

  dragStart = () => {
    const hit = this.pointer.castPointerRay();
    if(hit) {
      const { object } = hit as Intersection;
      const { key, draggable } = object.userData as DragUserData;        
      if (draggable && key !== undefined) {
        const clicked = this.transforms.find((item) => item.key === key);
        if(!clicked) {
          return;
        }

        this.active = clicked;
        this.active.startDrag();
      }
    }
  };

  dragEnd = (cancelled: boolean = false) => {
    if (this.active) {
      this.active.stopDrag(cancelled);
      this.active = null;
    }
  };

  dragUpdate = () => {
    if (this.active) {
      const hits = this.pointer.castPointerRay(true) as Array<Intersection>;
      if(hits?.length) {
        const floorHit = hits.find((hit) => {
          const { object } = hit;
          return object.userData.isFloor;
        });

        if (floorHit) {
          const { x, y, z } = floorHit.point;
          this.active.drag({x, y, z});
        }
      }
    }
  };

  update = () => {
    this.dragUpdate();
  };
}
