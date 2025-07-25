import * as THREE from 'three';

export interface SceneElements {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  buildings: THREE.Object3D[];
}