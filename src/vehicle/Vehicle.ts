// @ts-types="@types/three"
import { Group, Material, Mesh, Vector3, BoxGeometry, MeshStandardMaterial } from "three";
import config from "../game/config.ts";
import { GridSystem } from "../game/level/LevelGrid.ts";

export type VehicleConfig = {
  speed: number;
  fadeTime: number;
  maxLifetime: number;
  maxVehicleCount: number;
  spawnInterval: number;
  maxRecursiveRetry: number;
  maxHistory: number;
};

export default class Vehicle implements GridSystem {
  id: string;
  group: Group;

  private mesh: Mesh;
  private config: VehicleConfig

  constructor(id: string) {
    this.id = id;
    this.group = new Group();
    
    this.mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    this.group.add(this.mesh);
    
    this.config = globalThis.structuredClone(config.vehicle);
  }

  start = () => {
    console.log('starting vehicle');
  }

  update = () => {
    // frame loop

    // console.log('Real vehicle system');
  };


  /**
   * 
   * cleanup
   */

  getMaterial = (): Material | null => {
    let material = null;
    this.group.traverse((child) => {
      if(child instanceof Mesh) {
        material = child.material;        
      }
    });
    return material;
  };

  dispose = () => {
    // this.getMaterial()?.dispose();
    // this.removeFromParent();
  };
}
