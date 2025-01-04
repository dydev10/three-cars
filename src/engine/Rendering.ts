// @ts-types="@types/three"
import { CineonToneMapping, PCFSoftShadowMap, Scene, WebGLRenderer } from "three";
import Game from "./Game.ts";
import View from "./View.ts";
import Viewport from "./utils/Viewport.ts";

export default class Rendering {
  renderer: WebGLRenderer;
  game: Game;
  canvas: HTMLCanvasElement;
  viewport: Viewport;
  scene: Scene;
  view: View;

  constructor() {
    this.game = Game.Instance;
    this.canvas = this.game.domElement;
    this.viewport = this.game.viewport;
    this.scene = this.game.world.scene;
    this.view = this.game.view;
    
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.setupInstance();

    // @ts-expect-error why-never-expected
    this.viewport.addEventListener('resize', this.resize);
    // @ts-expect-error why-never-expected
    this.game.time.addEventListener('tick', this.update);
  }

  setupInstance = () => {
    this.renderer.toneMapping = CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor('#211d20');
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(this.viewport.pixelRatio);
  };

  resize = () => {
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(this.viewport.pixelRatio);
  };

  update = () => {
    this.renderer.render(this.scene, this.view.camera);
  };
}
