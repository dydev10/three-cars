// @ts-types="@types/three"
import { Group } from "three";
import VehicleGraphNode from "../VehicleGraphNode.ts";
import { tileToDeg } from "../../engine/helpers/rotation.ts";

export type TileEdge = {
  in: VehicleGraphNode | null;
  out: VehicleGraphNode | null;
}

export const roadOffset = 0.1;
export const tileOffset = 0.3;

export default class VehicleGraphTile extends Group {
  left: TileEdge;
  right: TileEdge;
  top: TileEdge;
  bottom: TileEdge;

  junctionTR: VehicleGraphNode;
  junctionTL: VehicleGraphNode;
  junctionBR: VehicleGraphNode;
  junctionBL: VehicleGraphNode;

  tileRotation: number;
  
  constructor(x: number, y: number, rotation: number) {
    super();
    this.position.set(x, 0, y);
    this.tileRotation = rotation;
    this.rotation.set(0, tileToDeg(this.tileRotation), 0);

    this.left = { in: null, out: null };
    this.right = { in: null, out: null };
    this.top = { in: null, out: null };
    this.bottom = { in: null, out: null };

    this.junctionTR = new VehicleGraphNode(roadOffset, -roadOffset);
    this.junctionTL = new VehicleGraphNode(-roadOffset, -roadOffset);
    this.junctionBR = new VehicleGraphNode(roadOffset, roadOffset);
    this.junctionBL = new VehicleGraphNode(-roadOffset, roadOffset);
  }

  /**
   * connects junctions with circular connections
   */
  connectJunctions = () => {
    this.add(this.junctionTR);
    this.add(this.junctionTL);
    this.add(this.junctionBR);
    this.add(this.junctionBL);
    this.junctionTR.connect(this.junctionTL);
    this.junctionTL.connect(this.junctionBL);
    this.junctionBL.connect(this.junctionBR);
    this.junctionBR.connect(this.junctionTR);
  };

  // TODO: refactor this, returns random edge in node
  getRandomNode = (): VehicleGraphNode | null => {
    const nodes = [];

    if (this.top.in) nodes.push(this.top.in); 
    if (this.bottom.in) nodes.push(this.bottom.in); 
    if (this.right.in) nodes.push(this.right.in); 
    if (this.left.in) nodes.push(this.left.in); 

    if (nodes.length) {
      const i = Math.floor(nodes.length * Math.random());
      return nodes[i];
    }
    return null;
  };

  disconnectAll = () => {
    for (const node of this.children) {
      if (node instanceof VehicleGraphNode) {
        node.disconnectAll();
        node.removeFromParent();
      }
    }
  };

  getWorldTopEdge = () => {
    switch(this.tileRotation) {
      case 0: return this.top;
      case 1: return this.left;
      case 2: return this.bottom;
      case 3: return this.right;
      default: return this.top;
    }
  };

  getWorldRightEdge = () => {
    switch(this.tileRotation) {
      case 0: return this.right;
      case 1: return this.top;
      case 2: return this.left;
      case 3: return this.bottom;
      default: return this.right;
    }
  };

  getWorldBottomEdge = () => {
    switch(this.tileRotation) {
      case 0: return this.bottom;
      case 1: return this.right;
      case 2: return this.top;
      case 3: return this.left;
      default: return this.bottom;
    }
  };

  getWorldLeftEdge = () => {
    switch(this.tileRotation) {
      case 0: return this.left;
      case 1: return this.bottom;
      case 2: return this.right;
      case 3: return this.top;
      default: return this.left;
    }
  };
}
