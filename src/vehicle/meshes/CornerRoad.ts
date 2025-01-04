// @ts-types="@types/three"
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { tileToDeg } from "../../engine/helpers/rotation.ts";

const geometry = new BoxGeometry(1, 1, 1);
geometry.translate(0, -5.5, 0);
const material = new MeshStandardMaterial({ color: 'black' });

export default class CornerRoad extends Group {
  constructor(rotation: number = 0) {
    super();
    this.rotation.set(0, tileToDeg(rotation), 0);
    // mainMesh
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.5, 0.1, 0.5);
    
    // connection mesh
    const connectionBottomMesh = new Mesh(geometry, material);
    connectionBottomMesh.scale.set(0.5, 0.1, 0.25);
    connectionBottomMesh.position.set(0, 0, 0.25 + 0.25 * 0.5);

    const connectionRightMesh = new Mesh(geometry, material);
    connectionRightMesh.scale.set(0.25, 0.1, 0.5);
    connectionRightMesh.position.set(0.25 + 0.25 * 0.5, 0, 0);

    this.add(mesh);
    this.add(connectionRightMesh);
    this.add(connectionBottomMesh);
  }
}