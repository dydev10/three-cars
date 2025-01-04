// @ts-types="@types/three"
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { tileToDeg } from "../../engine/helpers/rotation.ts";

const geometry = new BoxGeometry(1, 1, 1);
geometry.translate(0, -5.5, 0);
const material = new MeshStandardMaterial({ color: 'black' });

export default class StraightRoad extends Group {
  constructor(rotation: number = 0) {
    super();
    this.rotation.set(0, tileToDeg(rotation), 0);
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.5, 0.1, 1);

    this.add(mesh);
  }
}
