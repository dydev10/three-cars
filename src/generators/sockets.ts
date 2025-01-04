import Tiles, { TileSocketConfig } from "./Tiles.ts";

const sockets: TileSocketConfig[] = [
   /**
   * Blank tile
  */
  ...Tiles.generateTileSockets('blank',  ['AAA', 'AAA', 'AAA', 'AAA']),
  
  /**
   * Straight road
  */
  ...Tiles.generateTileSockets('straight',  ['ABA',  'AAA', 'ABA', 'AAA']),
  
  /**
   * End road
   */
  ...Tiles.generateTileSockets('end',  ['AAA', 'AAA', 'ABA', 'AAA']),
  
  /**
   * Corner road
  */
  ...Tiles.generateTileSockets('corner',  ['AAA', 'ABA', 'ABA', 'AAA']),
  
  /**
   * T intersection
  */
  ...Tiles.generateTileSockets('t',  ['AAA', 'ABA', 'ABA', 'ABA']),
  
  /**
   * Cross intersection
  */
  ...Tiles.generateTileSockets('cross',  ['ABA', 'ABA', 'ABA', 'ABA']),
];

export default sockets;