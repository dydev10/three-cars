// @ts-types="@types/three"
import { Object3D } from "three";
import config from "../game/config.ts";

export default class VehicleGraphNode extends Object3D {
  next: VehicleGraphNode[];

  constructor(x: number, y: number) {
    super();
    this.position.set(x, 0, y);
    this.next = [];
  }

  connect = (node: VehicleGraphNode | null) => {
    if (!node || this.next.includes(node)) {
      return;
    }
    this.next.push(node);
  };

  disconnectAll = () => {
    this.next = [];
  };

  /**
   * 
   * @param excludes recursively retries to exclude nodes in given list until max tries
   * @param retry current retry count
   * @returns { VehicleGraphNode | null }
   */
  getRandomNextNode = (excludes: VehicleGraphNode[] = [], retry: number = 0): VehicleGraphNode | null => {
    if(!this.next.length) return null;
    
    const i = Math.floor(Math.random() * this.next.length);
    let node: VehicleGraphNode | null = this.next[i];

    // retry recursively
    if(excludes.includes(node)) {

      // either return null to dispose or return the current wrong node
      if (retry > config.vehicle.maxRecursiveRetry) {
        return node;
      }

      node = this.getRandomNextNode(excludes , retry + 1);
    }

    return node;
  };
}
