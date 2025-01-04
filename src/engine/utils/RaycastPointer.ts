// @ts-types="@types/three"
import { Intersection, PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";

export default class RaycastPointer {
  camera: PerspectiveCamera;
  scene: Scene;
  point: Vector2;
  raycaster: Raycaster;
  hitPoint: Intersection | null | undefined;

  constructor(scene: Scene, camera: PerspectiveCamera) {
    this.camera = camera;
    this.scene = scene;
    this.point = new Vector2();
    this.raycaster = new Raycaster();

    globalThis.addEventListener('mousemove', this.mouseMove);
  }

  mouseMove = (event: MouseEvent) => {
    this.point.x = (event.clientX / globalThis.innerWidth) * 2 - 1;
    this.point.y = -(event.clientY / globalThis.innerHeight) * 2 + 1;  
  
    // this.castPointerRay();
  };
  
  /**
   * Raycasts from current mouse position on camera and returns first hit
   * 
   * @param all Default `false`. if true, array of all intersections is returned
   * @returns {Intersection | Array<Intersection>| null}
   */
  castPointerRay = (all: boolean = false): Intersection | Array<Intersection> | null => {
    this.raycaster.setFromCamera(this.point, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    this.hitPoint = intersects.length ? intersects[0] : null;
    
    if (all) {
      return intersects;
    }

    return this.hitPoint;
  };
}