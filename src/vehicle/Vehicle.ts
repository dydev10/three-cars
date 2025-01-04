// @ts-types="@types/three"
import { Group, Material, Mesh, Vector3 } from "three";
import config from "../game/config.ts";

export type VehicleConfig = {
  speed: number;
  fadeTime: number;
  maxLifetime: number;
  maxVehicleCount: number;
  spawnInterval: number;
  maxRecursiveRetry: number;
  maxHistory: number;
};

export default class Vehicle extends Group {
  config: VehicleConfig

  constructor(mesh: Mesh) {
    super();
    this.add(mesh);
    this.config = {...config.vehicle};


  }

  update = () => {
    // frame loop
  };


  /**
   * 
   * cleanup
   */

  getMaterial = (): Material | null => {
    let material = null;
    this.traverse((child) => {
      if(child instanceof Mesh) {
        material = child.material;        
      }
    });
    return material;
  };

  dispose = () => {
    this.getMaterial()?.dispose();
    this.removeFromParent();
  };
}
