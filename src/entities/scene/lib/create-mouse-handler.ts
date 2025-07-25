import * as THREE from "three";
import { ZOOM_CONFIG, INTERACTION_CONFIG } from '../constants';
import { CameraRefs } from "../types/camera-refs";
import { InteractionState } from "../types/interaction-state";
import { PopupData } from "../types/popup-data";

export const createMouseHandlers = (
  camera: THREE.OrthographicCamera,
  cameraRefs: CameraRefs,
  interactionState: InteractionState,
  container: HTMLDivElement,
  buildings: THREE.Object3D[],
  setPopup: (popup: PopupData | null) => void
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onMouseDown = (event: MouseEvent) => {
    interactionState.isDragging.current = true;
    interactionState.previousMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const onMouseUp = () => {
    interactionState.isDragging.current = false;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!interactionState.isDragging.current) return;
    
    const { clientWidth, clientHeight } = container;
    const deltaX = event.clientX - interactionState.previousMousePosition.current.x;
    const deltaY = event.clientY - interactionState.previousMousePosition.current.y;

    const moveX = -(deltaX / clientWidth) * (camera.right - camera.left) / camera.zoom * INTERACTION_CONFIG.PAN_SPEED;
    const moveY = (deltaY / clientHeight) * (camera.top - camera.bottom) / camera.zoom * INTERACTION_CONFIG.PAN_SPEED;

    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
    const moveVector = right.multiplyScalar(moveX).add(up.multiplyScalar(moveY));

    camera.position.add(moveVector);
    cameraRefs.target.current.add(moveVector);

    interactionState.previousMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const onClick = (event: MouseEvent) => {
    if (interactionState.isDragging.current && 
        (event.clientX !== interactionState.previousMousePosition.current.x || 
         event.clientY !== interactionState.previousMousePosition.current.y)) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings, true);
    
    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh;
      let userData = intersected.userData.type ? intersected.userData : intersected.parent?.userData;
      
      if (userData?.type === 'building') {
        setPopup({ x: event.clientX, y: event.clientY, text: `ID: ${userData.id}` });
      }
    }
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const newZoom = cameraRefs.targetZoom.current - event.deltaY * ZOOM_CONFIG.SPEED;
    cameraRefs.targetZoom.current = Math.max(ZOOM_CONFIG.MIN, Math.min(newZoom, ZOOM_CONFIG.MAX));
  };

  return { onMouseDown, onMouseUp, onMouseMove, onClick, onWheel };
};