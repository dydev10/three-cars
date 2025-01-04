import { VehicleConfig } from "../vehicle/Vehicle.ts";

export type GameConfig = {
  vehicle: VehicleConfig;
  grid: {
    size: number;
    unitRotation: number;
  },
}

const config: GameConfig = {
  vehicle: {
    speed: 0.0005,
    fadeTime: 1000,
    maxLifetime: 10000,
    maxVehicleCount: 1,
    spawnInterval: 1000,
    maxRecursiveRetry: 20,
    maxHistory: 4,
  },
  grid: {
    size: 20,
    unitRotation: 90,
  },
};

export default config;
