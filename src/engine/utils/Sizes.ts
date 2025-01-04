// @ts-types="@types/three"
import { EventDispatcher } from "three";

class Sizes extends EventDispatcher {
  width: number;
  height: number;
  ratio: number;
  pixelRatio: number;
  constructor() {
    super();

    this.width = globalThis.innerWidth;
    this.height = globalThis.innerHeight;
    this.ratio = globalThis.innerWidth / globalThis.innerHeight;
    this.pixelRatio = Math.min(globalThis.devicePixelRatio, 2);
    
    // on window resize
    globalThis.addEventListener('resize', () => {
      this.width = globalThis.innerWidth;
      this.height = globalThis.innerHeight;
      this.ratio = globalThis.innerWidth / globalThis.innerHeight;
      this.pixelRatio = Math.min(globalThis.devicePixelRatio, 2);
      
      // @ts-expect-error why-never-expected
      this.dispatchEvent({ type: 'resize' });
    });
  }
}

export default Sizes;
