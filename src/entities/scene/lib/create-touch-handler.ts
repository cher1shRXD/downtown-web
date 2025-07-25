import * as THREE from "three";
import { ZOOM_CONFIG, INTERACTION_CONFIG } from '../constants';
import { CameraRefs } from "../types/camera-refs";
import { InteractionState } from "../types/interaction-state";

export const createTouchHandlers = (
  camera: THREE.OrthographicCamera,
  cameraRefs: CameraRefs,
  interactionState: InteractionState,
  container: HTMLDivElement
) => {
  const getTouchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      interactionState.isDragging.current = true;
      interactionState.previousMousePosition.current = { 
        x: event.touches[0].clientX, 
        y: event.touches[0].clientY 
      };
    } else if (event.touches.length === 2) {
      interactionState.isDragging.current = false;
      interactionState.pinchDistance.current = getTouchDistance(event.touches);
      interactionState.initialPinchZoom.current = camera.zoom;
    }
  };

  const onTouchEnd = () => {
    interactionState.isDragging.current = false;
    interactionState.pinchDistance.current = 0;
  };

  const onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 1 && interactionState.isDragging.current) {
      const { clientWidth, clientHeight } = container;
      const deltaX = event.touches[0].clientX - interactionState.previousMousePosition.current.x;
      const deltaY = event.touches[0].clientY - interactionState.previousMousePosition.current.y;
      
      const moveX = -(deltaX / clientWidth) * (camera.right - camera.left) / camera.zoom * INTERACTION_CONFIG.PAN_SPEED;
      const moveY = (deltaY / clientHeight) * (camera.top - camera.bottom) / camera.zoom * INTERACTION_CONFIG.PAN_SPEED;
      
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const moveVector = right.multiplyScalar(moveX).add(up.multiplyScalar(moveY));
      
      camera.position.add(moveVector);
      cameraRefs.target.current.add(moveVector);
      
      interactionState.previousMousePosition.current = { 
        x: event.touches[0].clientX, 
        y: event.touches[0].clientY 
      };
    } else if (event.touches.length === 2) {
      const newDist = getTouchDistance(event.touches);
      
      if (interactionState.pinchDistance.current > 0) {
        const zoomFactor = newDist / interactionState.pinchDistance.current;
        const newZoom = interactionState.initialPinchZoom.current * zoomFactor;
        cameraRefs.targetZoom.current = Math.max(ZOOM_CONFIG.TOUCH_MIN, Math.min(newZoom, ZOOM_CONFIG.TOUCH_MAX));
      }
    }
  };

  return { onTouchStart, onTouchEnd, onTouchMove };
};