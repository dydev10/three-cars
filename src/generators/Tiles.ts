import { rotateArray } from "../engine/helpers/array.ts";

export type TileSocketConfig = {
  type: string
  rotation: 0 | 1 | 2 | 3;
  sockets: string[];
}

abstract class Tiles {
  static getRotatedSockets = (rotation: number, sockets: string[]) => {
  
    return rotateArray(sockets, rotation);;
  }

  static generateTileSockets = (type: string, sockets: string[]): TileSocketConfig[] => {
    return Array.from({ length: sockets.length }).map((_, i) => ({
      type,
      rotation: i,
      // sockets: WaveFunctionCollapse.getRotatedSockets(i, sockets)
      sockets: rotateArray(sockets, i)
    } as TileSocketConfig));
  }
}

export default Tiles;