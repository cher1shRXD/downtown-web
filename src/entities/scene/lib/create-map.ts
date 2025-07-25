import { MAP_CONFIG, MAP_DATA } from "../constants";
import { LoadedModels } from "../types/loaded-models";
import { getModelConfig } from "./get-model-config";
import * as THREE from 'three';

export const createMap = (models: LoadedModels, scene: THREE.Scene): void => {
  const { TILE_SIZE, WIDTH, HEIGHT } = MAP_CONFIG;
  
  for (let x = 0; x < WIDTH; x++) {
    for (let z = 0; z < HEIGHT; z++) {
      const tileType = MAP_DATA[z][x];
      const config = getModelConfig(tileType);
      
      if (!config || !models[config.modelKey]) continue;
      
      const model = models[config.modelKey].clone();
      const position = new THREE.Vector3(
        (x - WIDTH / 2) * TILE_SIZE + TILE_SIZE / 2,
        config.positionY,
        (z - HEIGHT / 2) * TILE_SIZE + TILE_SIZE / 2
      );
      
      model.scale.set(config.scale.x, config.scale.y, config.scale.z);
      model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
      model.position.copy(position);
      
      model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      scene.add(model);
    }
  }
};