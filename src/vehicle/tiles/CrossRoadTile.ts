import VehicleGraphNode from "../VehicleGraphNode.ts";
import VehicleGraphTile, { roadOffset, tileOffset } from "./VehicleGraphTile.ts";

export default class CrossRoadTile extends VehicleGraphTile {
  constructor(x: number, y: number, rotation: number) {
    super(x, y, rotation);

    // top edge
    this.top.in =  new VehicleGraphNode(-roadOffset, -tileOffset);
    this.top.out = new VehicleGraphNode(roadOffset, -tileOffset);

    // bottom edge
    this.bottom.in =  new VehicleGraphNode(roadOffset, tileOffset);
    this.bottom.out = new VehicleGraphNode(-roadOffset, tileOffset);
    
    // right edge
    this.right.in =  new VehicleGraphNode(tileOffset, -roadOffset);
    this.right.out = new VehicleGraphNode(tileOffset, roadOffset);
    
    // left edge
    this.left.in =  new VehicleGraphNode(-tileOffset, roadOffset);
    this.left.out = new VehicleGraphNode(-tileOffset, -roadOffset);

    this.add(this.top.in);
    this.add(this.top.out);

    this.add(this.bottom.in);
    this.add(this.bottom.out);

    this.add(this.right.in);
    this.add(this.right.out);
    
    this.add(this.left.in);
    this.add(this.left.out);

    /**
     * connections
     * 
     * */
    // use default circular junctions
    this.connectJunctions();

    // from/to top
    this.top.in.connect(this.junctionTL);
    this.junctionTR.connect(this.top.out);

    // from/to bottom
    this.bottom.in.connect(this.junctionBR);
    this.junctionBL.connect(this.bottom.out);
    
    // from/to right
    this.right.in.connect(this.junctionTR);
    this.junctionBR.connect(this.right.out);
    
    // from/to left
    this.left.in.connect(this.junctionBL);
    this.junctionTL.connect(this.left.out);
  }
}