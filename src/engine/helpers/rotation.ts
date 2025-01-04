// @ts-types="@types/three"
import { MathUtils } from "three";
import config from "../../game/config.ts";

/**
 * converts the tile rotation defined in config to rotation in negative degrees
 */
export const tileToDeg = (rotation: number) => {
  return MathUtils.degToRad(rotation * - config.grid.unitRotation);
};
