
import CornerRoad from "./CornerRoad.ts";
import CrossRoad from "./CrossRoad.ts";
import EndRoad from "./EndRoad.ts";
import BlankRoad from "./BlankRoad.ts";
import StraightRoad from "./StraightRoad.ts";
import TRoad from "./TRoad.ts";

abstract class RoadMesh {
  static create (type: string, rotation: number = 0)  {
    switch (type) {
      case 'blank': return new BlankRoad(rotation);
      case 'straight': return new StraightRoad(rotation);
      case 't': return new TRoad(rotation);
      case 'cross': return new CrossRoad(rotation);
      case 'corner': return new CornerRoad(rotation);
      case 'end': return new EndRoad(rotation);
      default: return new StraightRoad(rotation);
    }
  };
}

export default RoadMesh;
