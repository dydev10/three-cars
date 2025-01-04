// @ts-types="@types/three"
import { BoxGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial, NormalBufferAttributes } from "three";

class Box extends Mesh {
  override geometry: BufferGeometry<NormalBufferAttributes>;
  override material: Material | Material[];
  constructor(width: number = 1, height: number = 1, depth: number = 1) {
    super();
    this.geometry = new BoxGeometry(width, height, depth);
    this.material = new MeshStandardMaterial({
      color: '#ff33ff',
      transparent: true,
      // wireframe: true,
    });
  }
}

export default Box;
