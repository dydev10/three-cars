// @ts-types="@types/three"
import { EventDispatcher } from "three";
import { pickRandom } from "../engine/helpers/array.ts";
import sockets from "./sockets.ts";
import { TileSocketConfig } from "./Tiles.ts";
import { reverseString } from "../engine/helpers/string.ts";


export type WaveTile = {
  collapsed: boolean;
  options: number[];
  cell: number[];
  type: string | null;
  rotation: number;
}

export type WaveTileDomains = {
  up: number[];
  right: number[];
  down: number[];
  left: number[];
}

export default class WaveFunctionCollapse  extends EventDispatcher {
  size: number;
  running: boolean;
  done: boolean;
  waveGrid: WaveTile[];
  tiles: TileSocketConfig[];
  tileDomains: WaveTileDomains[];

  constructor(size: number) {
    super();

    this.size = size;
    this.running = false;
    this.done = false;
    this.tiles = globalThis.structuredClone(sockets);
    this.waveGrid = [];
    this.tileDomains = [];

    this.setupGrid();
    this.setupTileDomains();
    this.analyzeAllTiles();

    console.log('WaveFunctionCollapse:: init size', size);
  }

  setRunning = (start: boolean) => {
    this.running = start;
  };

  start = () => {
    this.done = false;
    this.running = true;
  };

  finish = () => {
    this.done = true;
    this.running = false;

    // @ts-expect-error never
    this.dispatchEvent({ type: 'collapsed' });
  };

  update = () => {
    if (this.running) {
      this.iterateWaveCollapse();
    }
  };

  generate = () => {

  };

  resetTile = (tile: WaveTile) => {
    tile.collapsed = false;
    tile.options = Array.from(this.tiles, (_t, index) => index);
    tile.type = null;
    tile.rotation = 0;
  };

  /**
   * recomputes the tile and its neighbors by running collapsing all tiles again
   */
  regenerate = (x: number, y: number) => {
    const rootTile = this.waveGrid[x + this.size * y];
    
    const upTile = this.waveGrid[x + this.size * (y - 1)];
    const rightTile = this.waveGrid[(x + 1) + this.size * y];
    const downTile = this.waveGrid[x + this.size * (y + 1)];
    const leftTile = this.waveGrid[(x - 1) + this.size * y];

    this.resetTile(rootTile);
    this.resetTile(upTile);
    this.resetTile(rightTile);
    this.resetTile(downTile);
    this.resetTile(leftTile);

    this.start();
  };


  /**
   * Refactor zone
   */


  /**
   * Refactor zone START
   */

  setupGrid = () => {
    for (let i = 0; i < this.size * this.size; i++) {
      this.waveGrid[i] = {
        collapsed: false,
        options: Array.from(this.tiles, (_t, index) => index),
        // cell: [Math.floor(i / DIM), i % DIM ],
        cell: [i % this.size, Math.floor(i / this.size)],
        type: null,
        rotation: 0,
      }
    }

    console.log('WaveFunctionCollapse:: setupGrid', this.waveGrid);
  };

  setupTileDomains = () => {
    this.tileDomains = this.tiles.map(() => {
      return {
        up: [],
        right: [],
        down: [],
        left: []
      };
    })
    console.log('WaveFunctionCollapse:: setupTileDomains', this.tileDomains);
  };

  compareEdge = (edge1: string, edge2: string) => {
    return edge1 === reverseString(edge2);
  }

  // TODO: generates tile domain from tiles, name needs to change
  analyzeTile = (tileIndex: number) => {
    const allTileDomains = this.tileDomains;
    const testTile = this.tiles[tileIndex];
    const testSockets = testTile.sockets;
    const testTileDomains = allTileDomains[tileIndex];
    
    this.tiles.forEach((tile, index) => {
      const tileSockets = tile.sockets;
      
      // UP
      if(this.compareEdge(tileSockets[2], testSockets[0])) {
        testTileDomains.up.push(index);
      }

      // RIGHT
      if(this.compareEdge(tileSockets[3], testSockets[1])) {
        testTileDomains.right.push(index);
      }

      // DOWN
      if(this.compareEdge(tileSockets[0], testSockets[2])) {
        testTileDomains.down.push(index);
      }

      // LEFT
      if(this.compareEdge(tileSockets[1], testSockets[3])) {
        testTileDomains.left.push(index);
      }
    });
  };

  // TODO: calls tile domain generator , name needs to change
  analyzeAllTiles = () => {
    this.tiles.forEach((_tile, index) => {
      this.analyzeTile(index);
    });
  }

  // TODO: refactor, filter our entries from arr not in validOptions
  filterByValidOptions = (arr: number[], validOptions: number[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const element = arr[i];

      if(!validOptions.includes(element)) {
        arr.splice(i, 1);
      }
    }

    return arr;
  };

  iterateWaveCollapse = () => {
    console.log('@@@ iterateWaveCollapse');
    

    let gridCopy = this.waveGrid.slice();

    gridCopy = gridCopy.filter(a => !a.collapsed);

    if(!gridCopy.length) {
      if(!this.waveGrid.length) {
        return;
      }
      
      console.log('All Collapsed', this.waveGrid);
      
      this.finish();
      return;
    }

    gridCopy.sort((a, b) => {
      return a.options.length - b.options.length;
    });
    

    const minLen = gridCopy[0].options.length;
    
    gridCopy = gridCopy.filter((item) => {
      return item.options.length <= minLen;
    });

    const cell = pickRandom(gridCopy);

    cell.collapsed = true;
    const pick = pickRandom(cell.options);

    if(pick === undefined) {
      console.log('Error NO Options left:: Backtracking required ahead');
      
      this.finish();
      return;
    }

    const pickedTile = this.tiles[pick];
    cell.type = pickedTile.type;
    cell.rotation = pickedTile.rotation;
    cell.options = [pick];


    const nextGrid = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i + this.size * j;
        const currentGrid = this.waveGrid;

        // copy tile if it's collapse and skip it
        if(currentGrid[index].collapsed) {
          nextGrid[index] = currentGrid[index];
          continue;
        }

        let nextOptions = Array.from(this.tiles, (_t, index) => index);

        // Look Up (-y)
        if(j > 0) {
          const upTile = currentGrid[i + (j - 1) * this.size];
          let validOptions: number[] = [];

          upTile.options.forEach((option) => {
            const valid = this.tileDomains[option].down;
            validOptions = validOptions.concat(valid);
          });

          nextOptions = this.filterByValidOptions(nextOptions, validOptions);
        }

        // Look Right (+x)
        if(i < this.size - 1) {
          const rightTile = currentGrid[(i + 1) + j * this.size];
          let validOptions: number[] = [];

          rightTile.options.forEach((option) => {
            const valid = this.tileDomains[option].left;
            validOptions = validOptions.concat(valid);
          });

          nextOptions = this.filterByValidOptions(nextOptions, validOptions);
        }
        
        // Look Down (+y)
        if(j < this.size - 1) {
          const downTile = currentGrid[i + (j + 1) * this.size];
          let validOptions: number[] = [];

          downTile.options.forEach((option) => {
            const valid = this.tileDomains[option].up;
            validOptions = validOptions.concat(valid);
          });

          nextOptions = this.filterByValidOptions(nextOptions, validOptions);
        }

        // Look Left (-x)
        if(i > 0) {
          const leftTile = currentGrid[(i - 1) + j * this.size];
          let validOptions: number[] = [];

          leftTile.options.forEach((option) => {
            const valid = this.tileDomains[option].right;
            validOptions = validOptions.concat(valid);
          });

          nextOptions = this.filterByValidOptions(nextOptions, validOptions);
        }

        nextGrid[index] = {
          options: nextOptions,
          collapsed: false,
          // cell: currentGrid[index].cell,
          cell: [i, j],
          type: null,
          rotation: 0,
        }
      }
    }

    this.waveGrid = nextGrid;
  };

  /**
   * Refactor zone END
   */

}
