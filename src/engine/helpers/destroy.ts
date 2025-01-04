// @ts-types="@types/three"
import { Mesh, Scene } from "three";

export function sceneDisposeDeep(scene: Scene) {
  // Traverse the whole scene
  scene.traverse((child) => {
    // Test if it's a mesh
    if (child instanceof Mesh) {
      child.geometry.dispose();

      // Loop through the material properties
      for (const key in child.material) {
        const value = child.material[key];

        // Test if there is a dispose function
        if (value && typeof value.dispose === "function") {
          value.dispose();
        }
      }
    }
  });
}
