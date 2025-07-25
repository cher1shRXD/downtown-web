import * as THREE from 'three';

export interface CameraRefs {
  target: React.RefObject<THREE.Vector3>;
  targetZoom: React.RefObject<number>;
}