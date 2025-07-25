import { COLORS } from "../constants";
import * as THREE from 'three';

export const setupLighting = (scene: THREE.Scene): void => {
  const directionalLight = new THREE.DirectionalLight(COLORS.WHITE, 1.2);
  directionalLight.position.set(-100, 150, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  const ambientLight = new THREE.AmbientLight(COLORS.WHITE, 0.5);
  scene.add(ambientLight);
};