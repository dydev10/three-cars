// @ts-types="@types/three"
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { tileToDeg } from "../../engine/helpers/rotation.ts";

const geometry = new BoxGeometry(1, 1, 1);
geometry.translate(0, -5.5, 0);
const material = new MeshStandardMaterial({ color: 'black' });

export default class CrossRoad extends Group {
  constructor(rotation: number = 0) {
    super();
    this.rotation.set(0, tileToDeg(rotation), 0);
    // mainMesh
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(1, 0.1, 0.5);
    
    // connection mesh
    const connectionTopMesh = new Mesh(geometry, material);
    connectionTopMesh.scale.set(0.5, 0.1, 0.25);
    connectionTopMesh.position.set(0, 0, -(0.25 + 0.25 * 0.5));

    const connectionBottomMesh = new Mesh(geometry, material);
    connectionBottomMesh.scale.set(0.5, 0.1, 0.25);
    connectionBottomMesh.position.set(0, 0, 0.25 + 0.25 * 0.5);

    this.add(mesh);
    this.add(connectionTopMesh);
    this.add(connectionBottomMesh);
  }
}