import VehicleGraphNode from "../VehicleGraphNode.ts";
import VehicleGraphTile, { roadOffset, tileOffset } from "./VehicleGraphTile.ts";

export default class EndRoadTile extends VehicleGraphTile {
  constructor(x: number, y: number, rotation: number) {
    super(x, y, rotation);

    // bottom edge
    this.bottom.in =  new VehicleGraphNode(roadOffset, tileOffset);
    this.bottom.out = new VehicleGraphNode(-roadOffset, tileOffset);

    this.add(this.bottom.in );
    this.add(this.bottom.out);
    /**
     * connections
     * 
     * */
    // use default circular junctions
    this.connectJunctions();

    // connections
    this.bottom.in.connect(this.junctionBR);
    this.junctionBL.connect(this.bottom.out);    
  }
}
