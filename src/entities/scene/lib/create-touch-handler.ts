import * as THREE from "three";
import { ZOOM_CONFIG } from "../constants";
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
        y: event.touches[0].clientY,
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
      const { clientWidth } = container;
      const deltaX =
        event.touches[0].clientX -
        interactionState.previousMousePosition.current.x;

      const rotationSpeed = 2;
      const rotationAngle = -(deltaX / clientWidth) * Math.PI * rotationSpeed;

      const rotationAxis = new THREE.Vector3(0, 1, 0);

      const cameraOffset = new THREE.Vector3().subVectors(
        camera.position,
        cameraRefs.target.current
      );
      cameraOffset.applyAxisAngle(rotationAxis, rotationAngle);

      camera.position.copy(cameraRefs.target.current).add(cameraOffset);
      camera.lookAt(cameraRefs.target.current);

      interactionState.previousMousePosition.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      const newDist = getTouchDistance(event.touches);

      if (interactionState.pinchDistance.current > 0) {
        const zoomFactor = newDist / interactionState.pinchDistance.current;
        const newZoom = interactionState.initialPinchZoom.current * zoomFactor;
        const clampedZoom = Math.max(
          ZOOM_CONFIG.TOUCH_MIN,
          Math.min(newZoom, ZOOM_CONFIG.TOUCH_MAX)
        );

        // 👉 줌 중심 계산
        const rect = container.getBoundingClientRect();
        const touchMidX =
          (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const touchMidY =
          (event.touches[0].clientY + event.touches[1].clientY) / 2;

        const ndc = new THREE.Vector2(
          ((touchMidX - rect.left) / rect.width) * 2 - 1,
          -((touchMidY - rect.top) / rect.height) * 2 + 1
        );

        // 👉 줌 전 기준 지점 world 좌표
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, camera);
        const worldBefore = new THREE.Vector3();
        raycaster.ray.at(1, worldBefore);

        // 줌 적용
        camera.zoom = clampedZoom;
        camera.updateProjectionMatrix();
        cameraRefs.targetZoom.current = clampedZoom;

        // 👉 줌 후 기준 지점 world 좌표
        raycaster.setFromCamera(ndc, camera);
        const worldAfter = new THREE.Vector3();
        raycaster.ray.at(1, worldAfter);

        // 👉 그 차이만큼 카메라 & 타겟을 같이 보정
        const offset = new THREE.Vector3().subVectors(worldBefore, worldAfter);
        camera.position.add(offset);
        cameraRefs.target.current.add(offset);

        camera.lookAt(cameraRefs.target.current);
      }
    }
  };

  return { onTouchStart, onTouchEnd, onTouchMove };
};
