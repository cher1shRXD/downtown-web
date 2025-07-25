import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { LoadedModels } from "../types/loaded-models";
import { MODEL_URLS } from "../constants";

export const loadAllModels = async (): Promise<LoadedModels> => {
  const loader = new GLTFLoader();
  const loadedModels: LoadedModels = {};
  
  for (const key in MODEL_URLS) {
    try {
      const gltf = await loader.loadAsync(MODEL_URLS[key as keyof typeof MODEL_URLS]);
      loadedModels[key] = gltf.scene;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
    }
  }
  
  return loadedModels;
};