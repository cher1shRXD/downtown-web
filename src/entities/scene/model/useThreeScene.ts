import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { MAP_CONFIG, INTERACTION_CONFIG } from '../constants';
import { PopupData } from '../types/popup-data';
import { CameraRefs } from '../types/camera-refs';
import { InteractionState } from '../types/interaction-state';
import { createMouseHandlers } from '../lib/create-mouse-handler';
import { createTouchHandlers } from '../lib/create-touch-handler';
import { createScene } from '../lib/create-scene';
import { createCamera } from '../lib/create-camera';
import { createRenderer } from '../lib/create-renderer';
import { setupLighting } from '../lib/setup-lighting';
import { createGround } from '../lib/create-ground';
import { loadAllModels } from '../lib/load-all-models';
import { createMap } from '../lib/create-map';

export const useThreeScene = (
  mountRef: React.RefObject<HTMLDivElement | null>,
  setPopup: (popup: PopupData | null) => void
) => {
  const cameraRefs: CameraRefs = {
    target: useRef(new THREE.Vector3(0, 0, 0)),
    targetZoom: useRef(2),
  };

  const interactionState: InteractionState = {
    isDragging: useRef(false),
    previousMousePosition: useRef({ x: 0, y: 0 }),
    pinchDistance: useRef(0),
    initialPinchZoom: useRef(1),
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const buildings: THREE.Object3D[] = [];

    const scene = createScene();
    const mapGroup = new THREE.Group();
    scene.add(mapGroup);
    const camera = createCamera(cameraRefs);
    const renderer = createRenderer(currentMount);
    
    setupLighting(scene);
    const ground = createGround();
    mapGroup.add(ground);

    const mouseHandlers = createMouseHandlers(
      camera, cameraRefs, interactionState, currentMount, buildings, mapGroup, scene, setPopup
    );
    const touchHandlers = createTouchHandlers(
      camera, cameraRefs, interactionState, currentMount, mapGroup
    );

    const handleResize = () => {
      const { clientWidth, clientHeight } = currentMount;
      renderer.setSize(clientWidth, clientHeight);
      
      const aspect = clientWidth / clientHeight;
      camera.left = (-MAP_CONFIG.SIZE * aspect) / 2;
      camera.right = (MAP_CONFIG.SIZE * aspect) / 2;
      camera.top = MAP_CONFIG.SIZE / 2;
      camera.bottom = -MAP_CONFIG.SIZE / 2;
      camera.updateProjectionMatrix();
    };

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      camera.zoom += (cameraRefs.targetZoom.current - camera.zoom) * INTERACTION_CONFIG.ZOOM_SMOOTH;
      camera.updateProjectionMatrix();
      camera.lookAt(cameraRefs.target.current);
      renderer.render(scene, camera);
    };

    currentMount.addEventListener("mousedown", mouseHandlers.onMouseDown);
    currentMount.addEventListener("mouseup", mouseHandlers.onMouseUp);
    currentMount.addEventListener("mousemove", mouseHandlers.onMouseMove);
    currentMount.addEventListener("click", mouseHandlers.onClick);
    currentMount.addEventListener("wheel", mouseHandlers.onWheel, { passive: false });
    currentMount.addEventListener("touchstart", touchHandlers.onTouchStart, { passive: false });
    currentMount.addEventListener("touchend", touchHandlers.onTouchEnd);
    currentMount.addEventListener("touchmove", touchHandlers.onTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);

    handleResize();
    animate();

    loadAllModels().then(models => createMap(models, mapGroup));

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousedown", mouseHandlers.onMouseDown);
      currentMount.removeEventListener("mouseup", mouseHandlers.onMouseUp);
      currentMount.removeEventListener("mousemove", mouseHandlers.onMouseMove);
      currentMount.removeEventListener("click", mouseHandlers.onClick);
      currentMount.removeEventListener("wheel", mouseHandlers.onWheel);
      currentMount.removeEventListener("touchstart", touchHandlers.onTouchStart);
      currentMount.removeEventListener("touchend", touchHandlers.onTouchEnd);
      currentMount.removeEventListener("touchmove", touchHandlers.onTouchMove);
      
      // Dispose of Three.js objects to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      // Stop the animation loop
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement.parentElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mountRef, setPopup]);
};