// @ts-types="@types/three"
import { Group, Intersection, MeshStandardMaterial } from "three";
// @ts-types="tweakpane"
import { FolderApi } from "tweakpane";
import Game from "../../engine/Game.ts";
import config from '../config.ts';
// import Floor from "./Floor";
import IDraggable from "../../engine/world/IDraggable.ts";
import FloorBlock from "./FloorBlock.ts";
import RaycastPointer from "../../engine/utils/RaycastPointer.ts";
import Toolbar from "../../engine/Toolbar.ts";
import Inputs, { InputActionEvent } from "../../engine/utils/Inputs.ts";
import GridAsset from "./GridAsset.ts";
import CityHouse from "../../engine/shapes/CityHouse.ts";
import Road from "../../engine/shapes/Road.ts";
import Ball from "../../engine/shapes/Ball.ts";
import VehicleGraph from "../../vehicle/VehicleGraph.ts";
import RoadMesh from "../../vehicle/meshes/RoadMesh.ts";
import WaveFunctionCollapse from "../../generators/WaveFunctionCollapse.ts";

export type GridXY = {
  x: number;
  y: number
};

export type GridTile = GridXY & {
  id: number;
  block: FloorBlock;
  // asset?: 'string';
  asset?: GridAsset;
};

type GridSystem = {
  id: string,
  group: Group,
  update: () => void,
};

/**
 * Basic level with grid based floor blocks
 */
export default class LevelGrid {
  game: Game;
  inputs: Inputs;
  debug: FolderApi;
  pointer: RaycastPointer;
  toolbar: Toolbar;
  size: number;
  // floor: Floor;
  grid: Array<Array<GridTile>>;
  hoveredTile: GridTile | null;
  // gizmo: Gizmo;
  transforms: Array<IDraggable>;
  systems: Array<GridSystem>; // TODO: Define interface for level system
  generator: WaveFunctionCollapse; // TODO: Combine with system or new interface

  constructor(game: Game) {
    this.game = game;
    this.debug = this.game.debug.ui.addFolder({
      title: 'Level Grid',
    });
    this.inputs = this.game.inputs;
    this.pointer = this.game.pointer;
    this.toolbar = this.game.toolbar;
    this.size = config.grid.size;
    this.transforms = [];
    this.systems = [];
    // this.floor = new Floor(this.width, this.height);
    this.grid = [];
    this.hoveredTile = null;
    console.log('LevelGrid:: init');
  
    // setup debug
    this.createDebugFolder();

    // setup grid with block meshes
    this.createGrid();

    // setup camera
    // this.setupCamera();
    this.set2DCamera();

    // Init systems
    this.setupSystems();

    // setup generator
    this.generator = new WaveFunctionCollapse(this.size);

    // @ts-expect-error never
    this.inputs.addEventListener('click', this.onInputClick);

    // @ts-expect-error never
    this.generator.addEventListener('collapsed', this.handleGeneratedGrid)
  }

  createDebugFolder = () => {
    const floorHideBtn = this.debug.addButton({
      title: 'Hide',
      label: 'floor'
    });
    const floorShowBtn = this.debug.addButton({
      title: 'Show',
      label: 'floor'
    });

    const cameraResetBtn = this.debug.addButton({
      title: 'Reset',
      label: 'camera'
    });
    const camera2DBtn = this.debug.addButton({
      title: '2D',
      label: 'camera'
    });
    
    floorHideBtn.on('click', this.hideGridBlocks);
    floorShowBtn.on('click', this.showGridBlocks);
  
    cameraResetBtn.on('click', this.setupCamera);
    camera2DBtn.on('click', this.set2DCamera);

    // generator debug
    const iterateBtn = this.debug.addButton({
      title: 'Iterate',
      label: 'wave fn'
    });
    const generateBtn = this.debug.addButton({
      title: 'Generate',
      label: 'wave fn'
    });
    iterateBtn.on('click', () => {
      this.generator.iterateWaveCollapse();
      this.handleGeneratedGrid();
    });
    generateBtn.on('click', () => {
      this.generator.setRunning(true)
    });
  };

  createGrid = () => {
    const grid: Array<Array<GridTile>> = [];
    for (let x = 0; x < this.size; x++) {
      const column = [];
      for (let y = 0; y < this.size; y++) {
        const block = new FloorBlock({ x, y });
        const tile: GridTile = {
          block,
          id: block.mesh.id,
          x: x,
          y: y,
        };
        column.push(tile);
        this.game.world.scene.add(block.mesh);
      }
      grid.push(column);
    }
    this.grid = grid;
  };

  setupCamera = () => {
    this.game.view.camera.position.set(-10, 8, -10);
  };

  set2DCamera = () => {
    this.game.view.camera.position.set(0, 8, 1);
  };

  setupSystems = () => {
    const vehicleGraph =  new VehicleGraph(this.size);
    this.systems.push({
      id: 'vehicleGraph',
      group: vehicleGraph,
      update: vehicleGraph.update,
    });
    this.game.world.scene.add(vehicleGraph);
    this.debug.addBinding(vehicleGraph.helper, 'visible', {
      label: 'Vehicle helper'
    });

    console.log('LevelGrid:: Setup systems');
  };

  handleGeneratedGrid = () => {
    this.generator.waveGrid.forEach((waveTile) => {
      const { cell, type, rotation, collapsed } = waveTile;
      this.updateGeneratedTileAsset(type, rotation, cell);

      if(!collapsed) {
        console.log('Not colapsed', cell, type);
        
      }
    });
  }

  addTestCube = () => {
    console.log('Grid test tile');
  };

  setGridAsset = (asset: GridAsset) => {
    if(!this.hoveredTile) {
      return;
    }
    this.removeHoveredTileAsset();
    asset.addToGrid({
      x: this.hoveredTile.x,
      y: this.hoveredTile.y
    });
    this.hoveredTile.asset = asset;
  };

  addRoad = () => {
    /**
     * auto road tool hANDLING
     */
    if (!this.hoveredTile) return;
    const { x, y } = this.hoveredTile;

    this.generator.regenerate(x, y);

    // const roadMesh = new Road();
    // const gridAsset = new GridAsset(this.game, roadMesh,);
    // this.setGridAsset(gridAsset);
  };

  addCity = () => {
    const cityMesh = new CityHouse();
    const gridAsset = new GridAsset(this.game, cityMesh);
    this.setGridAsset(gridAsset);
  };

  // TODO, used as debugger
  addFox = () => {
    const ballMesh = new Ball();
    const gridAsset = new GridAsset(this.game, ballMesh);
    this.setGridAsset(gridAsset);
  };

  // BROKEN
  rotateHoveredTileAsset = () => {
    if (!this.hoveredTile?.asset) return;
    
    const nextRotation = this.hoveredTile.asset.rotation + 1;
    const nextAsset = this.hoveredTile.asset.clone(nextRotation);
    this.setGridAsset(nextAsset);

    // call tool rotate handlers after asset is updated
    this.handleRoadTool();
  };

  updateGeneratedTileAsset = (type: string | null, rotation: number, cell: number[]) => {
    // if (!this.hoveredTile?.asset) return;
    if (!type) return;
    const [x, y] = cell;
    const currentTile = this.grid[x][y];
    const currentAsset = currentTile?.asset;

    // Skip mesh update for unchanged tiles
    if(currentAsset?.type === type && currentAsset?.rotation === rotation) {
      return;
    }

    if (currentAsset) {
      currentAsset.removeFromGrid();
    }

    const roadMesh = RoadMesh.create(type, 0);
    const roadAsset = new GridAsset(this.game, roadMesh, rotation, type);
    roadAsset.addToGrid({
      x,
      y
    });
    this.grid[x][y].asset = roadAsset;

    // call tool handler after asset is updated
    this.addRoadNodes(x, y, roadAsset);
  };

  removeHoveredTileAsset = () => {
    if(!this.hoveredTile) {
      return;
    }

    const { asset } = this.hoveredTile;
    if (!asset) {
      return;
    }

    asset.removeFromGrid();

    this.hoveredTile.asset = undefined;
  };

  addRoadAsset = (type: string, rotation: number = 0) => {
    const roadMesh = RoadMesh.create(type, 0);
    const roadAsset = new GridAsset(this.game, roadMesh, rotation, type);
    this.setGridAsset(roadAsset);
  };

  handleRoadTool = () => {
    const { action } = this.toolbar;
    if (!action || !this.hoveredTile || !this.systems.length) return;

    const vehicleGraph = this.systems[0].group;

    if (vehicleGraph instanceof VehicleGraph) {
      if (action === 'remove') {
        vehicleGraph.updateTile(this.hoveredTile.x, this.hoveredTile.y, null);
      }

      if (action === 'rotate') {
        const { x, y, asset } = this.hoveredTile;
        if (!asset) return;
        const rotation = asset.rotation;
        const type = asset.type;
        vehicleGraph.updateTile(x, y, type, rotation);
      }

      const actionParts = action.split('_');
      if (actionParts.length > 1) {
        const rotation = 0;
        const roadType = actionParts[1];
        this.addRoadAsset(roadType, rotation);
        vehicleGraph.updateTile(this.hoveredTile.x, this.hoveredTile.y, roadType, rotation);
      }
    }
  };

  addRoadNodes = (x: number = 0, y: number = 0, asset?: GridAsset) => {
    if (!this.systems.length) return;
    const vehicleGraph = this.systems[0].group;

    if (vehicleGraph instanceof VehicleGraph) {
      if (!asset?.type ) {
        vehicleGraph.updateTile(x, y, null);
        return;
      }

      const { type , rotation } = asset;
      vehicleGraph.updateTile(x, y, type, rotation);
    }
  };

  applyToolbarAction = () => {
    const { action } = this.toolbar;

    // vehicle graph tool, also triggers on remove to handle removing
    if (action?.startsWith('road_') || action === 'remove') {
      this.handleRoadTool();
    }

    if (action === 'road') {
      this.addRoad();
    }
    if (action === 'city') {
      this.addCity();
    }
    if (action === 'fox') {
      this.addFox();
    }
    if (action === 'rotate') {
      this.rotateHoveredTileAsset();
    }
    if (action === 'remove') {
      this.removeHoveredTileAsset();
    }

    console.log('Applying action on level', action);
  };

  onInputClick = (event: InputActionEvent) => {
    if(event.message.start) {
      this.applyToolbarAction();
    }
  };

  resetHoverMaterial = () => {
    const material =  this.hoveredTile?.block.mesh.material;
    if (material instanceof MeshStandardMaterial) {
      material.color.set('green');
    }
  };

  setHoverMaterial = () => {
    const material =  this.hoveredTile?.block.mesh.material;
    if (material instanceof MeshStandardMaterial) {
      material.color.set('red');
    }
  };

  onBlockHover = (pos: GridXY) => {
    const block = this.grid[pos.x][pos.y];
    if (this.hoveredTile === block) {
      return;
    }
    this.resetHoverMaterial();
    this.hoveredTile = block;
    this.setHoverMaterial();
  };

  hoverGrid = () => {
    const hits = this.pointer.castPointerRay(true) as Array<Intersection>;
    if(hits?.length) {
      const floorHit = hits.find((hit) => hit.object.userData.isFloor);
      if (floorHit) {
        // const { x, y, z } = floorHit.point;
        const { x, y } = floorHit.object.userData;
        this.onBlockHover({ x, y });
      }
    }
  };

  hideGridBlocks = () => {
    this.grid.flat().forEach((block) => {
      block.block.mesh.visible = false;
    });
  };

  showGridBlocks = () => {
    this.grid.flat().forEach((block) => {
      block.block.mesh.visible = true;
    });
  };

  /**
   * Frame loop
   */
  update = () => {
    this.hoverGrid();
    
    // call update on each system
    for (const system of this.systems) {
      system.update();
    }
    
    // update generator
    if (this.generator) {
      this.generator.update();
    }
  };
}