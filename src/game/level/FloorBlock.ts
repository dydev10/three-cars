// @ts-types="@types/three"
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { GridXY } from "./LevelGrid.ts";

export default class FloorBlock {
  x: number;
  y: number;
  mesh: Mesh;

  constructor(pos: GridXY) {
    this.x = pos.x;
    this.y = pos.y;
    this.mesh = this.createBlock();
  }

  createBlock = () => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({ color: 'green' });
    const mesh = new Mesh(geometry, material);
    mesh.position.x = this.x;
    mesh.position.z = this.y;
    mesh.userData.isFloor = true;
    mesh.userData.x = this.x;
    mesh.userData.y = this.y;

    // shift down by half height + gap
    mesh.position.y = -0.51;

    return mesh;
  };
}