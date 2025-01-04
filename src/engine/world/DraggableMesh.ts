// @ts-types="@types/three"
import { Group, Mesh, MeshStandardMaterial } from "three";
import RAPIER from "@dimforge/rapier3d";
import IDraggable from "./IDraggable.ts";

export type DragUserData = {
  draggable: boolean;
  isDragging: boolean;
  key: number;
};

export default class DraggableMesh implements IDraggable {
  key: number;
  draggable: boolean;
  isDragging: boolean;
  savedPosition: {x: number, y: number, z: number };
  mesh: Mesh | Group | undefined;
  body: RAPIER.RigidBody | undefined;
  
  constructor() {
    this.draggable = true;
    this.isDragging = false;
    this.key = 0;
    this.savedPosition = { x: 0, y: 0, z: 0 };
  }
  
  setSavedPosition = () => {
    if(this.body) {
      const { x, y, z } = this.body.translation();
      this.savedPosition = {x, y, z};
    };
  };

  setBodyDynamic = () => {
    if(this.body) {
      this.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    };
  };

  setBodyKinematic = () => {
    if(this.body) {
      this.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    };
  };

  setupDraggable = () => {
    const { mesh } = this;
    const dragData: DragUserData = {
      draggable: this.draggable,
      isDragging: this.isDragging,
      key: this.key,
    };
    if(mesh) {
      mesh.userData = {
        ...mesh.userData,
        ...dragData,
      };
    };

    this.setSavedPosition();
  };

  setDragOpacity = () => {
    if(this.mesh && this.mesh instanceof Mesh) {
      const material = this.mesh.material as MeshStandardMaterial;
      if(this.isDragging) {
        material.opacity = 0.8;
      } else {
        material.opacity = 1;
      }
    }
  };

  startDrag = () => {
    if (this.mesh) {
      this.isDragging = true;
      this.mesh.userData.isDragging = true;

      this.setDragOpacity();
    }
    
    this.setSavedPosition();
    this.setBodyKinematic();
  };

  stopDrag = (cancelled: boolean = false) => {
    if (this.mesh) {
      this.isDragging = false;
      this.mesh.userData.isDragging = false;
      this.setDragOpacity();
    }

    if (this.body) {
      if (cancelled) {        
        const { x, y, z } = this.savedPosition;
        // this.body.setNextKinematicTranslation({ x, y, z });
        this.body.setTranslation({ x, y, z }, true);
      }
      this.setBodyDynamic();
    }
  };

  drag = (position: { x: number; y: number; z: number; }) => {    
    if (this.body) {
      const currentY = this.body.translation().y;
      this.body.setNextKinematicTranslation({
        x: position.x,
        y: currentY,
        z: position.z,
      });
    }
  };
}
