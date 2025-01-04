// @ts-types="@types/three"
import { Group, Vector3 } from "three";
import VehicleGraphHelper from "./VehicleGraphHelper.ts";
import config from "../game/config.ts";
import Vehicle from "./Vehicle.ts";
import Box from "../engine/shapes/Box.ts";
import VehicleGraphTile from "./tiles/VehicleGraphTile.ts";
import RoadTile from "./tiles/RoadTile.ts";

export const UP = new Vector3(0, 1, 0);
export const FORWARD = new Vector3(1, 0, 0);

export type VehicleGraphTilesData = Array<Array<VehicleGraphTile | null>>;

export type VehicleConfig = {
  speed: number;
  fadeTime: number;
  maxLifetime: number;
  maxVehicleCount: number;
  spawnInterval: number;
  maxRecursiveRetry: number;
  maxHistory: number;
};

export default class VehicleGraph extends Group {
  size: number;
  
  tiles: VehicleGraphTilesData;
  vehicles: Group;
  
  helper: VehicleGraphHelper;

  constructor(size: number) {
    super();
    this.size = size;

    this.tiles = this.createGrid();
    this.vehicles = new Group();
    this.add(this.vehicles);

    this.helper = new VehicleGraphHelper();
    this.add(this.helper);
    
    this.helper.draw(this);
    // spawn random vehicles
    globalThis.setInterval(this.spawnVehicle, config.vehicle.spawnInterval);
  }

  createGrid = () => {
    const grid: VehicleGraphTilesData = [];
    for (let x = 0; x < this.size; x++) {
      const column = [];
      for (let y = 0; y < this.size; y++) {
        column.push(null);
      }
      grid.push(column);
    }
    return grid;
  };

  connectAdjacentTiles = (x: number, y: number) => {
    const tile = this.getTile(x, y);
    const topTile = this.getTile(x, y - 1);
    const bottomTile = this.getTile(x, y + 1);
    const rightTile = this.getTile(x + 1, y);
    const leftTile = this.getTile(x - 1, y);

    if(!tile) return;

    if (topTile) {
      tile?.getWorldTopEdge().out?.connect(topTile.getWorldBottomEdge().in);
      topTile?.getWorldBottomEdge().out?.connect(tile.getWorldTopEdge().in);
    }
    
    if (bottomTile) {
      tile?.getWorldBottomEdge().out?.connect(bottomTile.getWorldTopEdge().in);
      bottomTile?.getWorldTopEdge().out?.connect(tile.getWorldBottomEdge().in);
    }

    if (rightTile) {
      tile?.getWorldRightEdge().out?.connect(rightTile.getWorldLeftEdge().in);
      rightTile?.getWorldLeftEdge().out?.connect(tile.getWorldRightEdge().in);
    }

    if (leftTile) {
      tile?.getWorldLeftEdge().out?.connect(leftTile.getWorldRightEdge().in);
      leftTile?.getWorldRightEdge().out?.connect(tile.getWorldLeftEdge().in);
    }
  };

  updateTile(x: number, y: number, roadType: string | null, rotation: number = 0) {
    const existingTile = this.getTile(x, y);
    const topTile = this.getTile(x, y - 1);
    const bottomTile = this.getTile(x, y + 1);
    const rightTile = this.getTile(x + 1, y);
    const leftTile = this.getTile(x - 1, y);
    

    // disconnect existing tile and adjacent tiles from each
    existingTile?.disconnectAll();
    topTile?.getWorldBottomEdge()?.out?.disconnectAll();
    bottomTile?.getWorldTopEdge()?.out?.disconnectAll();
    rightTile?.getWorldLeftEdge()?.out?.disconnectAll();
    leftTile?.getWorldRightEdge()?.out?.disconnectAll();

    // TODO: get rotation from mesh
    if (roadType === null) {
      // remove tile
      this.tiles[x][y] = null;
    } else {
      // create new tile and add connections
      const tile = RoadTile.create(x, y, rotation, roadType);
      this.tiles[x][y] = tile;
      this.add(tile);
      this.connectAdjacentTiles(x, y);
    }

    this.helper.draw(this);
  };

  getTile = (x: number, y: number): VehicleGraphTile | null => {
    if (
      x >= 0 && x < this.size
      && y >= 0 && y < this.size
    ) {
     return this.tiles[x][y]; 
    }
    return null;
  };

  // TODO: refactor this, returns random tile
  getStartingTile = ():VehicleGraphTile | null => {
    const tiles = [];
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = this.getTile(x, y);
        if (tile) {
          tiles.push(tile);
        }
      }
    }

    if (!tiles.length) {
      return null;
    }

    const i = Math.floor(tiles.length * Math.random());
    return tiles[i];
  };

  spawnVehicle = () => {
    if (this.vehicles.children.length < config.vehicle.maxVehicleCount) {
      const startingTile = this.getStartingTile();
      if (!startingTile) return; 
      
      const origin = startingTile.getRandomNode();
      const destination = origin?.getRandomNextNode();
      if (!origin || !destination) return;
      
      const vehicleMesh = new Box(0.3, 0.2, 0.18);
      const vehicle = new Vehicle(origin, destination, vehicleMesh);
      this.vehicles.add(vehicle);
    }
  };

  update = () => {
    for (const vehicle of this.vehicles.children as Vehicle[]) {
      vehicle.update();
    }
  };
}
