import Time from "./utils/Time.ts";
import Rendering from "./Rendering.ts";
import Debug from "./utils/Debug.ts";
import Resources from "./utils/Resources.ts";
import sources from "../game/sources.ts";
import World from "./world/World.ts";
import Viewport from "./utils/Viewport.ts";
import View from "./View.ts";
import Inputs from "./utils/Inputs.ts";
import Physics from "./Physics.ts";
import PhysicsDebug from "./PhysicsDebug.ts";
import inputs from "../game/inputs.ts";
import RaycastPointer from "./utils/RaycastPointer.ts";
import Toolbar from "./Toolbar.ts";

export type GameSizes = {
  width: number;
  height: number;
}

export type GameContext = {
  domElement: HTMLCanvasElement;
  debug: Debug;
  inputs: Inputs;
  time: Time;
  viewport: Viewport;
  physics: Physics;
  physicsDebug: PhysicsDebug;
  resources: Resources;
  view: View;
  rendering: Rendering;
  world: World;
  pointer: RaycastPointer;
  toolbar: Toolbar;
}

class Game { 
  domElement: HTMLCanvasElement;
  debug: Debug;
  inputs: Inputs;
  time: Time;
  viewport: Viewport;
  physics: Physics;
  physicsDebug: PhysicsDebug;
  resources: Resources;
  view: View;
  rendering: Rendering;
  world: World;
  pointer: RaycastPointer;
  toolbar: Toolbar;
  
  // Singleton
  private static _instance: Game;

  private constructor() {
    // init singleton on first constructor call
    Game._instance = this;

    this.domElement = document.getElementById('canvas-game') as HTMLCanvasElement;
    console.log('Game:: canvas ID from DOM::', this.domElement.id);
    
    /**
     * Setup engine
     * order important
     */
    // debug
    this.debug = new Debug();

    // inputs
    this.inputs = new Inputs(inputs);
    // time
    this.time = new Time();
    // viewport
    this.viewport = new Viewport();
    // TODO: physics
    this.physics = new Physics();
    // ??? 
    this.resources = new Resources(sources);
    // ???
    // world
    this.world = new World();
    // TODO: physics debug
    this.physicsDebug = new PhysicsDebug();
    // view
    this.view = new View();
    // rendering
    this.rendering = new Rendering();
    // TODO: move vehicle code to this project

    // pointer [DEPENDS on World.scene, View.camera]
    this.pointer = new RaycastPointer(this.world.scene, this.view.camera);

    // toolbar [react uses this to trigger events for level]
    this.toolbar = new Toolbar();

    // @ts-expect-error why-never-expected
    this.time.addEventListener('tick', this.update);
  }

  update = () => {
    /**
     * Main game loop
     */
  };

  destroy = () => {
    // @ts-expect-error why-never-expected
    this.time.removeEventListener('tick', this.update);
    this.world.destroy();

    this.view.controls.dispose();
    this.rendering.renderer.dispose();
    if (this.debug.ui) {
      this.debug.ui.dispose();
    }
  };

  public static get Instance() {
    if(!this._instance) {
      return new this();
    }
    return this._instance;
  }
}

export default Game;