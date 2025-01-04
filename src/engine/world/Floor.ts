// @ts-types="@types/three"
import { BoxGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, Scene, SRGBColorSpace, Texture } from "three";
import Resources from "../utils/Resources.ts";
import Game from "../Game.ts";

export default class Floor {
  width: number;
  height: number;
  game: Game;
  scene: Scene;
  resources: Resources;
  geometry: BoxGeometry;
  textures: { color: Texture, normal: Texture };
  material: MeshStandardMaterial;
  mesh: Mesh;
  
  constructor(width: number = 20, height: number = 20) { 
    this.width = width;
    this.height = height;   
    this.game = Game.Instance;
    this.scene = this.game.world.scene;
    this.resources = this.game.resources;
  
    this.geometry = this.setGeometry();
    this.textures = this.setTextures();
    this.material = this.setMaterial();
    this.mesh = this.setMesh();
  }

  setGeometry = () => {
    this.geometry = new BoxGeometry(this.width, 2, this.height);

    return this.geometry;
  };
  setTextures = () => {
    const textureRepeat = 100;
    this.textures = {
      color: this.resources.items.grassColorTexture as Texture,
      normal: this.resources.items.grassNormalTexture as Texture
    };
    // color
    this.textures.color.colorSpace = SRGBColorSpace;
    this.textures.color.repeat.set(textureRepeat, textureRepeat);
    this.textures.color.wrapS = RepeatWrapping;
    this.textures.color.wrapT = RepeatWrapping;
    
    // normal
    this.textures.normal.repeat.set(textureRepeat, textureRepeat);
    this.textures.normal.wrapS = RepeatWrapping;
    this.textures.normal.wrapT = RepeatWrapping;

    return this.textures;
  };

  setMaterial = () => {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });

    return this.material;
  };

  setMesh = () => {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;

    this.mesh.userData = {
      isFloor: true,
    };

    this.scene.add(this.mesh);

    this.game.physics.addEntity(this.mesh, {
      type: 'fixed',
      position: { x: 0, y: -1.01, z: 0 },
      collider: {
        shape: 'cuboid',
        parameters: [this.width/2, 1, this.height/2],
      }
    });

    return this.mesh;
  };
}
