// @ts-types="@types/three"
import { CubeTexture, CubeTextureLoader, EventDispatcher, Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

export enum ResourceType {
  GLTF_MODEL = 'gltfModel', 
  TEXTURE = 'texture', 
  CUBE_TEXTURE = 'cubeTexture', 
}

type ResourceFile = GLTF | Texture | CubeTexture;

export type ResourceInfo = {
  name: string;
  type: string;
  path: string | Array<string>;
}

export type ResourceLoaders = {
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;
  cubeTextureLoader: CubeTextureLoader;
}

export default class Resources extends EventDispatcher {
  sources: Array<ResourceInfo>;
  loaders: ResourceLoaders;

  //state
  items: Record<string, ResourceFile>;
  loaded: number;
  toLoad: number;


  constructor(sources: Array<ResourceInfo>) {
    super();

    // config
    this.sources = sources;

    // setup
    this.items = {};
    this.loaded = 0;
    this.toLoad = this.sources.length;

    this.loaders = this.setupLoaders();
    this.startLoading();
  }

  setupLoaders = (): ResourceLoaders => {
    const loaders: ResourceLoaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };

    return loaders;
  };

  startLoading = () => {
    for (const source of this.sources) {
      if (source.type === ResourceType.GLTF_MODEL) {
        let url: string | Array<string> = source.path;
        if (url instanceof Array) {
          url = url[0];
        }
        this.loaders.gltfLoader.load(
          url,
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      }
      if (source.type === ResourceType.TEXTURE) {
        let url: string | Array<string> = source.path;
        if (url instanceof Array) {
          url = url[0];
        }
        this.loaders.textureLoader.load(
          url,
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      }
      if (source.type === ResourceType.CUBE_TEXTURE) {
        // TODO: remove array spread
        const url: Readonly<Array<string>> = [...source.path];
        this.loaders.cubeTextureLoader.load(
          url,
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      }
    }
  };

  sourceLoaded = (source: ResourceInfo, file: ResourceFile) => {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      console.log('Done Loading', this.items);
      
      // @ts-expect-error weird param type
      this.dispatchEvent({
        type: 'ready',
      });
    }
  };
}
