// @ts-types="tweakpane"
import { FolderApi } from "tweakpane";
import { InputActionEvent } from "../utils/Inputs.ts";
import Game from "../Game.ts";
import Floor from "./Floor.ts";
import Cube from "./Cube.ts";
import IDraggable from "./IDraggable.ts";
import Gizmo from "./Gizmo.ts";

/**
 * Basic level with Drag Drop Editor
 * contains floor an basic shapes with physics
 */
export default class Level {
  game: Game;
  debug: FolderApi;
  width: number;
  height: number;
  floor: Floor;
  gizmo: Gizmo;
  transforms: Array<IDraggable>;

  constructor(game: Game) {
    this.game = game;
    this.debug = this.game.debug.ui.addFolder({
      title: 'Level',
    });
    this.width = 25;
    this.height = 25;
    this.transforms = [];
    this.gizmo = new Gizmo(this.game, this.transforms);
    this.floor = new Floor(this.width, this.height);
    console.log('Level:: init', game, this.gizmo);
  
    this.setupDebugFolder();
    this.addDebugListener();
  }

  setupDebugFolder = () => {
    const cubeBtn = this.debug.addButton({
      title: 'Add',
      label: 'test cube'
    });
    cubeBtn.on('click', this.addTestCube)
  };

  addDebugListener = () => {
    const { inputs } = this.game;
    // @ts-expect-error why-never-expected
    inputs.addEventListener('jump', (event: InputActionEvent) => {
      if(event.message.start) {
        this.addTestCube();
      }
    });
  };

  addTestCube = () => {
    const { world } = this.game;
    const cube = new Cube(this.game);

    this.transforms.push(cube);      
    
    if(cube.mesh) {
      world.scene.add(cube.mesh);
    }
  };
}