// @ts-types="@types/three"
import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Game from "./Game.ts";
import Viewport from "./utils/Viewport.ts";

export default class View {
  game: Game;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  canvas: HTMLCanvasElement;
  viewport: Viewport;
  scene: Scene;

  constructor() {
    this.game = Game.Instance;
    this.canvas = this.game.domElement;
    this.viewport = this.game.viewport;
    this.scene = this.game.world.scene;
    // console.log('Camera:: Class', this.experience);

    this.camera = new PerspectiveCamera(
      35,
      this.viewport.ratio,
      0.1,
      100,
    );
    this.setupCamera();

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.setupOrbitControls();

    // @ts-expect-error why-never-expected
    this.viewport.addEventListener('resize', this.resize);
    // @ts-expect-error why-never-expected
    this.game.time.addEventListener('tick', this.update);
  }

  setupCamera = () => {
    this.camera.position.set(6, 4, 8);
    this.scene.add(this.camera);
  };

  setupOrbitControls = () => {
    this.controls.enableDamping = true;    
  };

  resize = () => {
    console.log('Cam View resize');
    this.camera.aspect = this.viewport.ratio;
    this.camera.updateProjectionMatrix();
  };

  update = () => {
    this.controls.update();
  };
}
