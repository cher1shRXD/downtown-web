import * as THREE from 'three';
import { ZOOM_CONFIG, INTERACTION_CONFIG } from '../constants';
import { CameraRefs } from '../types/camera-refs';
import { InteractionState } from '../types/interaction-state';
import { PopupData } from '../types/popup-data';

export const createMouseHandlers = (
  camera: THREE.OrthographicCamera,
  cameraRefs: CameraRefs,
  interactionState: InteractionState,
  container: HTMLDivElement,
  buildings: THREE.Object3D[],
  setPopup: (popup: PopupData | null) => void,
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onMouseDown = (event: MouseEvent) => {
    interactionState.isDragging.current = true;
    interactionState.previousMousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onMouseUp = () => {
    interactionState.isDragging.current = false;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!interactionState.isDragging.current) return;

    const { clientWidth } = container;
    const deltaX =
      event.clientX - interactionState.previousMousePosition.current.x;

    const rotationSpeed = 2;
    const rotationAngle = -(deltaX / clientWidth) * Math.PI * rotationSpeed;

    const rotationAxis = new THREE.Vector3(0, 1, 0);

    const cameraOffset = new THREE.Vector3().subVectors(
      camera.position,
      cameraRefs.target.current,
    );
    cameraOffset.applyAxisAngle(rotationAxis, rotationAngle);

    camera.position.copy(cameraRefs.target.current).add(cameraOffset);
    camera.lookAt(cameraRefs.target.current);

    interactionState.previousMousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onClick = (event: MouseEvent) => {
    if (
      interactionState.isDragging.current &&
      (event.clientX !== interactionState.previousMousePosition.current.x ||
        event.clientY !== interactionState.previousMousePosition.current.y)
    )
      return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings, true);

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh;
      let userData = intersected.userData.type
        ? intersected.userData
        : intersected.parent?.userData;

      if (userData?.type === 'building') {
        setPopup({
          x: event.clientX,
          y: event.clientY,
          text: `ID: ${userData.id}`,
        });
      }
    }
  };

  const onWheel = (event: WheelEvent) => {
  event.preventDefault();

  const rect = container.getBoundingClientRect();
  const ndc = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  // NDC를 world position으로 변환
  const worldBefore = new THREE.Vector3();
  raycaster.setFromCamera(ndc, camera);
  raycaster.ray.at(1, worldBefore); // 카메라 평면상에서 1 unit 앞의 위치

  // 줌 업데이트
  const newZoom =
    cameraRefs.targetZoom.current - event.deltaY * ZOOM_CONFIG.SPEED;
  const clampedZoom = Math.max(ZOOM_CONFIG.MIN, Math.min(newZoom, ZOOM_CONFIG.MAX));

  cameraRefs.targetZoom.current = clampedZoom;
  camera.zoom = clampedZoom;
  camera.updateProjectionMatrix();

  // 줌 이후의 world 위치
  const worldAfter = new THREE.Vector3();
  raycaster.setFromCamera(ndc, camera);
  raycaster.ray.at(1, worldAfter);

  // 카메라를 반대 방향으로 이동시켜 마우스 위치를 고정
  const offset = new THREE.Vector3().subVectors(worldBefore, worldAfter);
  camera.position.add(offset);
  cameraRefs.target.current.add(offset); // lookAt 위치도 같이 이동

  camera.lookAt(cameraRefs.target.current);
};

  return { onMouseDown, onMouseUp, onMouseMove, onClick, onWheel };
};
