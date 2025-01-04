// @ts-types="@types/three"
import { EventDispatcher } from "three";

export type TickEventType = 'tick';
export type TickEventMessage = {
  delta: number;
};

export type TickEvent =  {
  type: TickEventType;
  message: TickEventMessage;
}

class Time extends EventDispatcher {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    globalThis.requestAnimationFrame(this.tick);
  }

  tick = () => {    
    const currentTime = Date.now();    
    this.delta = (currentTime - this.current) * 0.001; // converted to seconds
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    

    // @ts-expect-error why-never-expected
    this.dispatchEvent({
      type: 'tick',
      message: {
        delta: this.delta,
      }
    });

    globalThis.requestAnimationFrame(this.tick);
  }
}

export default Time;
