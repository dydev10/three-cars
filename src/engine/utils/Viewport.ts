// @ts-types="@types/three"
import { EventDispatcher } from "three";

export default class Viewport extends EventDispatcher {
  width!: number;
  height!: number;
  ratio!: number;
  pixelRatio!: number;

  constructor() {
    super();

    this.measure();
    this.setResize();
  }

  measure = () => {
    this.width = globalThis.innerWidth;
    this.height = globalThis.innerHeight;
    this.ratio = globalThis.innerWidth / globalThis.innerHeight;
    this.pixelRatio = Math.min(globalThis.devicePixelRatio, 2);
  };

  resize = () => {
    this.measure();
    // @ts-expect-error why-never-expected
    this.dispatchEvent({ type: 'resize' });
  };

  setResize = () => {
    globalThis.addEventListener('resize', this.resize);
  };
}
