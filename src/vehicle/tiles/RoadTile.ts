import VehicleGraphTile from "./VehicleGraphTile.ts";
import CornerRoadTile from "./CornerRoadTile.ts";
import CrossRoadTile from "./CrossRoadTile.ts";
import EndRoadTile from "./EndRoadTile.ts";
import StraightRoadTile from "./StraightRoadTile.ts";
import TRoadTile from "./TRoadTile.ts";

abstract class RoadTile {
  static create(x: number, y: number, rotation: number, type: string): VehicleGraphTile {
    switch (type) {
      case 'blank': return new VehicleGraphTile(x, y, rotation);
      case 'straight': return new StraightRoadTile(x, y, rotation);
      case 't': return new TRoadTile(x, y, rotation);
      case 'cross': return new CrossRoadTile(x, y, rotation);
      case 'corner': return new CornerRoadTile(x, y, rotation);
      case 'end': return new EndRoadTile(x, y, rotation);
      default: return new StraightRoadTile(x, y, rotation);
    }
  };
}

export default RoadTile;
