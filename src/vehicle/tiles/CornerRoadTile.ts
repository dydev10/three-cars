import VehicleGraphNode from "../VehicleGraphNode.ts";
import VehicleGraphTile, { roadOffset, tileOffset } from "./VehicleGraphTile.ts";

export default class CornerRoadTile extends VehicleGraphTile {
  constructor(x: number, y: number, rotation: number) {
    super(x, y, rotation);

    // bottom edge
    this.bottom.in =  new VehicleGraphNode(roadOffset, tileOffset);
    this.bottom.out = new VehicleGraphNode(-roadOffset, tileOffset);
    
    // right edge
    this.right.in =  new VehicleGraphNode(tileOffset, -roadOffset);
    this.right.out = new VehicleGraphNode(tileOffset, roadOffset);

    this.add(this.bottom.in);
    this.add(this.bottom.out);
    this.add(this.right.in);
    this.add(this.right.out);

    /**
     * connections
     * 
     * */
    // use default circular junctions
    this.connectJunctions();

    // from bottom to right
    this.bottom.in.connect(this.junctionBR);
    this.junctionBR.connect(this.right.out);

    // from right to bottom
    this.right.in.connect(this.junctionTR);
    this.junctionBL.connect(this.bottom.out);
  }
}
