import { CAMERA_CONFIG, MAP_CONFIG } from "../constants";
import { CameraRefs } from "../types/camera-refs";
import * as THREE from 'three';

export const createCamera = (cameraRefs: CameraRefs): THREE.OrthographicCamera => {
  const { SIZE } = MAP_CONFIG;
  const { ANGLE, DISTANCE, INITIAL_POSITION } = CAMERA_CONFIG;
  
  const camera = new THREE.OrthographicCamera(
    -SIZE / 2, SIZE / 2, SIZE / 2, -SIZE / 2, 1, 1000
  );
  
  camera.position.set(
    INITIAL_POSITION.x,
    DISTANCE * Math.sin(ANGLE),
    DISTANCE * Math.cos(ANGLE)
  );
  
  camera.lookAt(cameraRefs.target.current);
  return camera;
};