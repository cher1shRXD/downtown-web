import { MAP_CONFIG, MAP_DATA } from "../constants";
import { LoadedModels } from "../types/loaded-models";
import { getModelConfig } from "./get-model-config";
import * as THREE from "three";

export const createMap = (
  models: LoadedModels,
  mapGroup: THREE.Group
): void => {
  const { TILE_SIZE, WIDTH, HEIGHT } = MAP_CONFIG;

  const roadGeometry = new THREE.BoxGeometry(TILE_SIZE, 0.1, TILE_SIZE);
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });

  for (let x = 0; x < WIDTH; x++) {
    for (let z = 0; z < HEIGHT; z++) {
      const tileType = MAP_DATA[z][x];

      if (tileType === 1) {
        const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);

        roadMesh.position.set(
          (x - WIDTH / 2) * TILE_SIZE + TILE_SIZE / 2,
          0.05,
          (z - HEIGHT / 2) * TILE_SIZE + TILE_SIZE / 2
        );

        roadMesh.receiveShadow = true;
        mapGroup.add(roadMesh);
        continue;
      }

      const config = getModelConfig(tileType);
      if (!config || !models[config.modelKey]) continue;

      const model = models[config.modelKey].clone();
      model.name = `${config.modelKey}`
      const position = new THREE.Vector3(
        (x - WIDTH / 2) * TILE_SIZE + TILE_SIZE / 2,
        config.positionY,
        (z - HEIGHT / 2) * TILE_SIZE + TILE_SIZE / 2
      );

      model.scale.set(config.scale.x, config.scale.y, config.scale.z);
      model.rotation.set(
        config.rotation.x,
        config.rotation.y,
        config.rotation.z
      );
      model.position.copy(position);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      mapGroup.add(model);
    }
  }
};
