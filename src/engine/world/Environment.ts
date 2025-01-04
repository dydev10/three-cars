// @ts-types="@types/three"
import { CubeTexture, DirectionalLight, Mesh, MeshStandardMaterial, Scene, SRGBColorSpace } from "three";
import Resources from "../utils/Resources.ts";
import Game from "../Game.ts";

type EnvironmentMapConfig = {
  intensity: number;
  texture: CubeTexture;
  updateMaterial: () => void;
}

export default class Environment {
  game: Game;
  scene: Scene;
  resources: Resources;
  sunLight: DirectionalLight;
  environmentMap: EnvironmentMapConfig;

  constructor() {
    this.game = Game.Instance;
    this.scene = this.game.world.scene;
    this.resources = this.game.resources;
  
    this.sunLight = this.setupSunLight();
    
    this.environmentMap = this.setupEnvironmentMap();
  }

  setupSunLight = () => {
    this.sunLight = new DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, - 2.25);
    this.scene.add(this.sunLight);
    return this.sunLight;
  };
  
  setupEnvironmentMap = () => {
    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture as CubeTexture,
    } as EnvironmentMapConfig;
    this.environmentMap.texture.colorSpace = SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;
    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof Mesh
          && child.material instanceof MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    return this.environmentMap;
  };
}
