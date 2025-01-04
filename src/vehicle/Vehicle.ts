// @ts-types="@types/three"
import { Group, Material, Mesh, Vector3 } from "three";
import VehicleGraphNode from "./VehicleGraphNode.ts";
import { FORWARD } from "./VehicleGraph.ts";
import config from "../game/config.ts";

export default class Vehicle extends Group {
  origin: VehicleGraphNode;
  destination: VehicleGraphNode;
  createdTime: number;
  cycleStartTime: number;

  originWorldPosition: Vector3;
  destinationWorldPosition: Vector3;
  originToDestination: Vector3;
  orientation: Vector3;

  recentNodes: VehicleGraphNode[];
  avoidTurn: boolean;
  
  
  constructor(origin: VehicleGraphNode, destination: VehicleGraphNode, mesh: Mesh) {
    super();
    
    this.origin = origin;
    this.destination = destination;
    this.add(mesh);
    
    this.createdTime = Date.now();
    this.cycleStartTime = this.createdTime;
    this.originWorldPosition = new Vector3();
    this.destinationWorldPosition = new Vector3();
    this.originToDestination = new Vector3();
    this.orientation = new Vector3();

    this.recentNodes = [];
    this.avoidTurn = false;

    this.updateWorldPosition();
  }

  getAge = () => {
    return Date.now() - this.createdTime;
  };

  /**
   * Returns normalized elapsed cycle time between 0 and 1
   */
  getCycleTime = (): number => {
    const distance = this.originToDestination.length();
    const cycleDuration = distance / config.vehicle.speed;
    const cycleTime = (Date.now() - this.cycleStartTime) / cycleDuration;

    return Math.min(1, Math.max(0, cycleTime));
  };

  /**
   * runs when starting vehicle cycle
   */
  updateWorldPosition = () => {
    this.origin.getWorldPosition(this.originWorldPosition);
    this.destination.getWorldPosition(this.destinationWorldPosition);
    
    this.originToDestination.copy(this.destinationWorldPosition);
    this.originToDestination.sub(this.originWorldPosition);

    this.orientation.copy(this.originToDestination);
    this.orientation.normalize();

    this.quaternion.setFromUnitVectors(FORWARD, this.orientation);
  };

  selectNextDestination = () => {
    this.recentNodes.push(this.origin);
    if (this.recentNodes.length > config.vehicle.maxHistory) {
      this.recentNodes.shift();
    }
  
    return this.origin.getRandomNextNode(this.recentNodes);
  };

  resetCycle = () => {
    this.cycleStartTime = Date.now();

    this.origin = this.destination;
    const nextDestination = this.selectNextDestination();

    if (!nextDestination) {
      this.dispose();
      return;
    }
    
    this.destination = nextDestination;
    this.updateWorldPosition();
  };

  getMaterial = (): Material | null => {
    let material = null;
    this.traverse((child) => {
      if(child instanceof Mesh) {
        material = child.material;        
      }
    });
    return material;
  };

  setOpacity = (value: number) => {
    const material = this.getMaterial();
    if (material) {
      material.opacity = Math.max(0, Math.min(value, 1));
    }
  };

  updateOpacity = () => {
    const age = this.getAge();
    
    if (age < config.vehicle.fadeTime) {
      this.setOpacity(age / config.vehicle.fadeTime)
    } else if ((config.vehicle.maxLifetime - age) < config.vehicle.fadeTime) {
      this.setOpacity((config.vehicle.maxLifetime - age) / config.vehicle.fadeTime)
    } else {
      this.setOpacity(1);
    }
  };

  update = () => {
    if (this.getAge() > config.vehicle.maxLifetime) {
      this.dispose();
    }

    const cycleTime = this.getCycleTime();
    if (cycleTime === 1) {
      this.resetCycle();
    } else {
      this.position.copy(this.originWorldPosition);
      this.position.lerp(this.destinationWorldPosition, cycleTime);
    }

    this.updateOpacity();
  };

  dispose = () => {
    this.getMaterial()?.dispose();
    this.removeFromParent();

    this.recentNodes = [];
  };
}
