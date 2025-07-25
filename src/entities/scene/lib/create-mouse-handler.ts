import * as THREE from "three";
import { ZOOM_CONFIG, CAMERA_CONFIG } from "../constants";
import { CameraRefs } from "../types/camera-refs";
import { InteractionState } from "../types/interaction-state";
import { PopupData } from "../types/popup-data";

export const createMouseHandlers = (
  camera: THREE.OrthographicCamera,
  cameraRefs: CameraRefs,
  interactionState: InteractionState,
  container: HTMLDivElement,
  buildings: THREE.Object3D[],
  mapGroup: THREE.Group,
  setPopup: (popup: PopupData | null) => void
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const initialCameraPosition = new THREE.Vector3(
    CAMERA_CONFIG.INITIAL_POSITION.x,
    CAMERA_CONFIG.DISTANCE * Math.sin(CAMERA_CONFIG.ANGLE),
    CAMERA_CONFIG.DISTANCE * Math.cos(CAMERA_CONFIG.ANGLE)
  );
  const initialTarget = new THREE.Vector3(0, 0, 0);

  // 확대 시 누적된 오프셋을 추적
  let accumulatedOffset = new THREE.Vector3(0, 0, 0);
  let accumulatedTargetOffset = new THREE.Vector3(0, 0, 0);

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
    mapGroup.rotateOnAxis(rotationAxis, rotationAngle);

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

      if (userData?.type === "building") {
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

    const newZoom =
      cameraRefs.targetZoom.current - event.deltaY * ZOOM_CONFIG.SPEED;
    const clampedZoom = Math.max(
      ZOOM_CONFIG.MIN,
      Math.min(newZoom, ZOOM_CONFIG.MAX)
    );

    // Zooming in (deltaY < 0)
    if (event.deltaY < 0) {
      const rect = container.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const worldBefore = new THREE.Vector3();
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.at(1, worldBefore);

      cameraRefs.targetZoom.current = clampedZoom;
      camera.zoom = clampedZoom;
      camera.updateProjectionMatrix();

      const worldAfter = new THREE.Vector3();
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.at(1, worldAfter);

      const offset = new THREE.Vector3().subVectors(worldBefore, worldAfter);
      
      // 카메라와 타겟 모두 이동
      camera.position.add(offset);
      cameraRefs.target.current.add(offset);
      
      // 누적 오프셋에 추가
      accumulatedOffset.add(offset);
      accumulatedTargetOffset.add(offset);
      
    } else { // Zooming out - 점진적으로 원상복구
      cameraRefs.targetZoom.current = clampedZoom;
      camera.zoom = clampedZoom;
      camera.updateProjectionMatrix();

      // Calculate interpolation factor based on how far from min zoom
      // When clampedZoom is MAX, factor is 0 (no interpolation)
      // When clampedZoom is MIN, factor is 1 (fully interpolated)
      const zoomRange = ZOOM_CONFIG.MAX - ZOOM_CONFIG.MIN;
      const currentZoomNormalized = (clampedZoom - ZOOM_CONFIG.MIN) / zoomRange;
      const interpolationFactor = 1 - currentZoomNormalized; // 0 when fully zoomed in, 1 when fully zoomed out

      // Smoothly interpolate camera position and target towards initial state
      // Use a small, constant lerp alpha for smoothness over multiple wheel events
      const lerpAlpha = 0.1; // Adjust for desired smoothness

      camera.position.lerp(initialCameraPosition, lerpAlpha * interpolationFactor);
      cameraRefs.target.current.lerp(initialTarget, lerpAlpha * interpolationFactor);

      // If we are at or below the minimum zoom, snap to initial state to ensure precision
      if (clampedZoom <= ZOOM_CONFIG.MIN) {
        camera.position.copy(initialCameraPosition);
        cameraRefs.target.current.copy(initialTarget);
        // Reset accumulated offsets if they were used for zoom-in
        // This ensures that next zoom-in starts from a clean state relative to initial
        accumulatedOffset.set(0, 0, 0);
        accumulatedTargetOffset.set(0, 0, 0);
      }
    }

    camera.lookAt(cameraRefs.target.current);
  };

  return { onMouseDown, onMouseUp, onMouseMove, onClick, onWheel };
};