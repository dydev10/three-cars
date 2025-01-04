// @ts-types="@types/three"
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } from "three";
// @ts-types="tweakpane"
import { FolderApi, TpChangeEvent } from "tweakpane";
import Game from "./Game.ts";

export default class PhysicsDebug {  
  game: Game;
  active: boolean;
  debug: FolderApi;
  geometry: BufferGeometry | null;
  material: LineBasicMaterial | null;
  lineSegments: LineSegments | null;
  
  constructor() {
    this.game = Game.Instance;
    this.active = false;
    this.debug = this.game.debug.ui.addFolder({
      title: 'Physics',
    });
    this.geometry = null;
    this.material = null;
    this.lineSegments = null;
  
    this.setupDebugFolder();

    // @ts-expect-error why-never-expected
    this.game.time.addEventListener('tick', this.update);
  }

  setupDebugFolder = () => {
    this.debug
      .addBinding(this, 'active', {
        label: 'Debug'
      })
      .on('change', this.debugActiveChange);
  };

  debugActiveChange = (event: TpChangeEvent<boolean>) => {
    const { value } = event;
    this.active = value;
    if(value) {
      this.createLines();
    } else {
      this.destroyLines();
    }
  }

  createLines = () => {
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new Float32BufferAttribute([], 3));
    this.geometry.setAttribute('color', new Float32BufferAttribute([], 4));
  
    this.material = new LineBasicMaterial({ vertexColors: true });
    this.lineSegments = new LineSegments(this.geometry, this.material);
    
    this.game.world.scene.add(this.lineSegments);
  };

  destroyLines = () => {
    if(this.geometry && this.material && this.lineSegments) {
      this.game.world.scene.remove(this.lineSegments);
  
      this.geometry.dispose();
      this.material.dispose();
      this.lineSegments = null;
    }
  };

  update = () => {
    if (this.active && this.geometry) {
      const { vertices, colors } = this.game.physics.world.debugRender();
      this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 4));
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.color.needsUpdate = true;
    }

  }
}
