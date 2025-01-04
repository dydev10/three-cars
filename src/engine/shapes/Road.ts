// @ts-types="@types/three"
import { BoxGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial, NormalBufferAttributes } from "three";

class Road extends Mesh {
  override geometry: BufferGeometry<NormalBufferAttributes>;
  override material: Material | Material[];
  constructor() {
    super();
    this.geometry = new BoxGeometry(1, 0.2, 1);
    this.material = new MeshStandardMaterial({
      color: '#0f0f0f',
      transparent: true,
    });

    // to move this mesh from center to the bottom of unit height
    this.geometry.translate(0, -0.4, 0);
  }
}

export default Road;
