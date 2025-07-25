import * as THREE from 'three'
import { COLORS } from '../constants';

export const createScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.SKY);
  return scene;
};