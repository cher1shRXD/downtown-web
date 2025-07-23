"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Scene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);

  // Refs for camera and interaction state must be at the top level
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetZoom = useRef(1);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera setup
    const mapSize = 400;
    const camera = new THREE.OrthographicCamera(-mapSize / 2, mapSize / 2, mapSize / 2, -mapSize / 2, 1, 1000);
    const angle = Math.PI / 9;
    const distance = 400;
    camera.position.set(120, distance * Math.sin(angle), distance * Math.cos(angle));
    camera.lookAt(cameraTarget.current);
    targetZoom.current = camera.zoom;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(100, 150, -100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Map data and creation
    const tileSize = 10;
    const mapWidth = 30;
    const mapHeight = 30;
    const mapData = [
      [0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,5,5,5,5,5,0,0,2,2,0,0,1,1,1,0,5,5,5,5,0,0,0,0,0,0,0,0,0],
      [0,5,5,5,5,5,5,5,0,2,2,0,0,1,0,1,0,5,5,5,5,5,0,0,0,0,0,0,0,0],
      [0,5,5,5,5,5,5,5,0,0,0,0,0,1,0,1,0,0,0,0,5,5,5,0,0,0,0,0,0,0],
      [0,0,5,5,5,5,5,0,0,0,0,0,0,1,0,1,0,0,0,0,0,5,5,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,3,3,3,3,1,0,1,3,3,3,3,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,3,3,3,3,1,0,1,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,3,3,3,3,1,0,1,3,3,3,3,0,0,0,0,0,0,0,0,0,0],
      [0,0,2,2,2,0,0,0,0,3,3,3,3,1,0,1,3,3,3,3,0,0,0,2,2,2,0,0,0,0],
      [0,0,2,2,2,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,2,2,2,0,0,0,0],
      [0,0,2,2,2,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,2,2,2,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,3,3,3,3,3,3,1,0,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,3,3,3,3,3,3,1,1,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,3,3,3,3,3,3,1,2,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,3,3,3,3,3,3,1,2,1,3,3,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,2,2,2,2,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,2,2,2,2,0,0,0],
      [0,0,2,2,2,2,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,2,2,2,2,0,0,0],
      [0,0,2,2,2,2,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,2,2,2,2,0,0,0],
      [0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0],
      [0,5,5,5,5,5,5,5,0,2,2,2,0,0,1,1,1,0,2,2,2,0,5,5,5,5,5,5,0,0],
      [0,5,5,5,5,5,5,5,0,2,2,2,0,0,1,0,1,0,2,2,2,0,5,5,5,5,5,5,0,0],
      [0,0,5,5,5,5,5,0,0,2,2,2,0,0,1,1,1,0,2,2,2,0,0,5,5,5,5,0,0,0],
      [0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0],
    ];
    const materials = { water: new THREE.MeshLambertMaterial({ color: 0x2196f3 }), ground: new THREE.MeshLambertMaterial({ color: 0x967969 }) };
    const groundThickness = 300;
    const groundGeometry = new THREE.BoxGeometry(mapWidth * tileSize, groundThickness, mapHeight * tileSize);
    const ground = new THREE.Mesh(groundGeometry, materials.ground);
    ground.position.y = -groundThickness / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const buildings: THREE.Object3D[] = [];
    const createMap = (models: { [key: string]: THREE.Group }) => {
        for (let x = 0; x < mapWidth; x++) {
            for (let z = 0; z < mapHeight; z++) {
                const tileType = mapData[z][x];
                const position = new THREE.Vector3((x - mapWidth / 2) * tileSize + tileSize / 2, 0, (z - mapHeight / 2) * tileSize + tileSize / 2);
                let model: THREE.Group | null = null;
                switch (tileType) {
                    case 0: break;
                    case 1: if (models.book1) { model = models.book1.clone(); model.scale.set(2, 7, 2.7); model.rotation.set(-300, 50, -10); position.y = 5; } break;
                    case 2: if (models.book3) { model = models.book3.clone(); model.scale.set(15, 15, 15); position.y = 0; model.userData = { id: `building_${x}_${z}`, type: 'building' }; buildings.push(model); } break;
                    case 4: if (models.book4) { model = models.book4.clone(); model.scale.set(5, 10, 5); position.y = 3; } break;
                    case 5: if (models.bookMany) { model = models.bookMany.clone(); model.scale.set(30, 30, 30); model.rotation.y = Math.random() * Math.PI; position.y = 0; } break;
                    case 3: const waterGeometry = new THREE.BoxGeometry(tileSize, 0.2, tileSize); const waterTile = new THREE.Mesh(waterGeometry, materials.water); waterTile.position.set(position.x, 0.1, position.z); scene.add(waterTile); break;
                }
                if (model) { model.position.copy(position); model.traverse(child => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; } }); scene.add(model); }
            }
        }
    };
    const loader = new GLTFLoader();
    const modelUrls = { book1: "/assets/book-1.glb", book3: "/assets/book-3.glb", book4: "/assets/book-4.glb", bookMany: "/assets/book-many.glb" };
    const loadAllModels = async () => {
        const loadedModels: { [key: string]: THREE.Group } = {};
        for (const key in modelUrls) { try { const gltf = await loader.loadAsync(modelUrls[key as keyof typeof modelUrls]); loadedModels[key] = gltf.scene; } catch (error) { console.error(`Failed to load ${key}:`, error); } }
        return loadedModels;
    };
    loadAllModels().then(createMap);

    // Event Listeners
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
        isDragging.current = true;
        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const onMouseMove = (event: MouseEvent) => {
        if (!isDragging.current) return;

        const deltaX = event.clientX - previousMousePosition.current.x;
        const deltaY = event.clientY - previousMousePosition.current.y;

        const panSpeed = 1.5;
        const moveX = -(deltaX / width) * (camera.right - camera.left) / camera.zoom * panSpeed;
        const moveY = (deltaY / height) * (camera.top - camera.bottom) / camera.zoom * panSpeed;

        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
        const moveVector = right.multiplyScalar(moveX).add(up.multiplyScalar(moveY));

        camera.position.add(moveVector);
        cameraTarget.current.add(moveVector);

        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const onClick = (event: MouseEvent) => {
      if (isDragging.current && (event.clientX !== previousMousePosition.current.x || event.clientY !== previousMousePosition.current.y)) return;
      const rect = currentMount.getBoundingClientRect();
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
      const zoomSpeed = 0.02;
      const minZoom = 0.5;
      const maxZoom = 4;
      let newZoom = targetZoom.current - event.deltaY * zoomSpeed;
      targetZoom.current = Math.max(minZoom, Math.min(newZoom, maxZoom));
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    currentMount.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("mousemove", onMouseMove);
    currentMount.addEventListener("click", onClick);
    currentMount.addEventListener("wheel", onWheel, { passive: false });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      camera.zoom += (targetZoom.current - camera.zoom) * 0.1;
      camera.updateProjectionMatrix();
      camera.lookAt(cameraTarget.current);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      currentMount.removeEventListener("mousedown", onMouseDown);
      currentMount.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("mousemove", onMouseMove);
      currentMount.removeEventListener("click", onClick);
      currentMount.removeEventListener("wheel", onWheel);
      if (renderer.domElement.parentElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {popup && (
        <div
          style={{
            position: "absolute",
            top: popup.y,
            left: popup.x,
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid black",
            transform: "translate(-50%, -120%)",
            whiteSpace: "nowrap",
          }}
        >
          <div>{popup.text}</div>
          <button onClick={() => setPopup(null)} style={{ marginTop: '5px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Scene;
