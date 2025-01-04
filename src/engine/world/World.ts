// @ts-types="@types/three"
import { Scene } from "three";
import Environment from "./Environment.ts";
import Resources from "../utils/Resources.ts";
import { sceneDisposeDeep } from "../helpers/destroy.ts";
import Fox from "./Fox.ts";
import Game from "../Game.ts";
// import Level from "./Level.ts";
import LevelGrid from "../../game/level/LevelGrid.ts";

export default class World {
  game: Game;
  scene: Scene;
  resources: Resources;
  environment!: Environment;
  // level!: Level;
  level!: LevelGrid;
  fox!: Fox;

  constructor() {    
    this.game = Game.Instance;
    this.scene = new Scene();
    this.resources = this.game.resources;

    // @ts-expect-error dispatch type
    this.resources.addEventListener('ready', () => {
      /**
       * Setup world
       */
      // this.level = new Level(this.game);
      this.level = new LevelGrid(this.game);
      // this.fox = new Fox();
      this.environment = new Environment();
    });
    // @ts-expect-error dispatch type
    this.game.time.addEventListener('tick', this.update);
  }

  update = () => {
    if (this.fox) {
      this.fox.update();
    }

    if (this.level && this.level.update) {
      this.level.update();
    }
  };

  destroy = () => {
    sceneDisposeDeep(this.scene);
  };
}
