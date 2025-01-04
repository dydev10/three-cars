// @ts-types="@types/three"
import { BoxGeometry, BufferGeometry, Color, Material, Mesh, MeshStandardMaterial, NormalBufferAttributes } from "three";

class CityHouse extends Mesh {
  override geometry: BufferGeometry<NormalBufferAttributes>;
  override material: Material | Material[];
  constructor() {
    super();

    const randomAdd = Math.random();
    this.geometry = new BoxGeometry(1, 1 + randomAdd, 1);
    this.material = new MeshStandardMaterial({
      color: new Color(Math.random(), Math.random(), 0.5),
      transparent: true,
    });

    // to move this mesh from center to the bottom of unit height
    this.geometry.translate(0, randomAdd * 0.5, 0);
  }
}

export default CityHouse;
