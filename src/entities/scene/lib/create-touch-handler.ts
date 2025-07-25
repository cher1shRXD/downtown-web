import * as THREE from "three";
import { ZOOM_CONFIG, CAMERA_CONFIG } from "../constants";
import { CameraRefs } from "../types/camera-refs";
import { InteractionState } from "../types/interaction-state";

export const createTouchHandlers = (
  camera: THREE.OrthographicCamera,
  cameraRefs: CameraRefs,
  interactionState: InteractionState,
  container: HTMLDivElement,
  mapGroup: THREE.Group
) => {
  const initialCameraPosition = new THREE.Vector3(
    CAMERA_CONFIG.INITIAL_POSITION.x,
    CAMERA_CONFIG.DISTANCE * Math.sin(CAMERA_CONFIG.ANGLE),
    CAMERA_CONFIG.DISTANCE * Math.cos(CAMERA_CONFIG.ANGLE)
  );
  const initialTarget = new THREE.Vector3(0, 0, 0);

  let accumulatedOffset = new THREE.Vector3(0, 0, 0);
  let accumulatedTargetOffset = new THREE.Vector3(0, 0, 0);
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
      mapGroup.rotateOnAxis(rotationAxis, rotationAngle);

      interactionState.previousMousePosition.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      if (interactionState.pinchDistance.current > 0) {
        const newDist = getTouchDistance(event.touches);
        const zoomFactor = newDist / interactionState.pinchDistance.current;
        const newZoom = interactionState.initialPinchZoom.current * zoomFactor;
        const clampedZoom = Math.max(
          ZOOM_CONFIG.TOUCH_MIN,
          Math.min(newZoom, ZOOM_CONFIG.TOUCH_MAX)
        );

        // Zooming in (newDist > interactionState.pinchDistance.current)
        if (newDist > interactionState.pinchDistance.current) {
          const rect = container.getBoundingClientRect();
          const touchMidX =
            (event.touches[0].clientX + event.touches[1].clientX) / 2;
          const touchMidY =
            (event.touches[0].clientY + event.touches[1].clientY) / 2;

          const ndc = new THREE.Vector2(
            ((touchMidX - rect.left) / rect.width) * 2 - 1,
            -((touchMidY - rect.top) / rect.height) * 2 + 1
          );

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(ndc, camera);
          const worldBefore = new THREE.Vector3();
          raycaster.ray.at(1, worldBefore);

          camera.zoom = clampedZoom;
          camera.updateProjectionMatrix();
          cameraRefs.targetZoom.current = clampedZoom;

          raycaster.setFromCamera(ndc, camera);
          const worldAfter = new THREE.Vector3();
          raycaster.ray.at(1, worldAfter);

          const offset = new THREE.Vector3().subVectors(worldBefore, worldAfter);
          camera.position.add(offset);
          cameraRefs.target.current.add(offset);

          accumulatedOffset.add(offset);
          accumulatedTargetOffset.add(offset);
        } else { // Zooming out
          camera.zoom = clampedZoom;
          camera.updateProjectionMatrix();
          cameraRefs.targetZoom.current = clampedZoom;

          const zoomRange = ZOOM_CONFIG.TOUCH_MAX - ZOOM_CONFIG.TOUCH_MIN;
          const currentZoomNormalized = (clampedZoom - ZOOM_CONFIG.TOUCH_MIN) / zoomRange;
          const interpolationFactor = 1 - currentZoomNormalized;

          const lerpAlpha = 0.1; // Adjust for desired smoothness

          camera.position.lerp(initialCameraPosition, lerpAlpha * interpolationFactor);
          cameraRefs.target.current.lerp(initialTarget, lerpAlpha * interpolationFactor);

          if (clampedZoom <= ZOOM_CONFIG.TOUCH_MIN) {
            camera.position.copy(initialCameraPosition);
            cameraRefs.target.current.copy(initialTarget);
            accumulatedOffset.set(0, 0, 0);
            accumulatedTargetOffset.set(0, 0, 0);
          }
        }

        camera.lookAt(cameraRefs.target.current);
      }
    }
  };

  return { onTouchStart, onTouchEnd, onTouchMove };
};
