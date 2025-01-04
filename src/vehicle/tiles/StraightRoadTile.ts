import VehicleGraphNode from "../VehicleGraphNode.ts";
import VehicleGraphTile, { roadOffset, tileOffset } from "./VehicleGraphTile.ts";

export default class StraightRoadTile extends VehicleGraphTile {
  constructor(x: number, y: number, rotation: number) {
    super(x, y, rotation);

    // bottom edge
    this.bottom.in =  new VehicleGraphNode(roadOffset, tileOffset);
    this.bottom.out = new VehicleGraphNode(-roadOffset, tileOffset);

    // top edge
    this.top.in =  new VehicleGraphNode(-roadOffset, -tileOffset);
    this.top.out = new VehicleGraphNode(roadOffset, -tileOffset);


    this.add(this.top.in);
    this.add(this.top.out);
    this.add(this.bottom.in );
    this.add(this.bottom.out);

    // connections
    this.top.in.connect(this.bottom.out);
    this.bottom.in.connect(this.top.out);
  }
}
