import { COLORS, MAP_CONFIG } from "../constants";
import * as THREE from 'three';

export const createGround = (scene: THREE.Scene): void => {
  const { TILE_SIZE, WIDTH, HEIGHT } = MAP_CONFIG;
  const groundThickness = 300;
  
  const groundGeometry = new THREE.BoxGeometry(
    WIDTH * TILE_SIZE,
    groundThickness,
    HEIGHT * TILE_SIZE
  );
  
  const groundMaterial = new THREE.MeshLambertMaterial({ color: COLORS.GROUND });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -groundThickness / 2;
  ground.receiveShadow = true;
  scene.add(ground);
};