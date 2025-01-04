// @ts-types="@types/three"
import { SphereGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial, NormalBufferAttributes } from "three";

class Ball extends Mesh {
  override geometry: BufferGeometry<NormalBufferAttributes>;
  override material: Material | Material[];
  constructor() {
    super();
    this.geometry = new SphereGeometry(0.1, 16, 16);
    this.material = new MeshStandardMaterial({
      color: '#3333ff',
      transparent: true,
      wireframe: true,
    });
  }
}

export default Ball;
