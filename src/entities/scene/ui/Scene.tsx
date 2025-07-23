"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Scene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 씬, 카메라, 렌더러 초기화
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // 하늘색 배경

    // 카메라 설정
    const mapSize = 400;
    const camera = new THREE.OrthographicCamera(-mapSize / 2, mapSize / 2, mapSize / 2, -mapSize / 2, 1, 1000);
    const angle = Math.PI / 9;
    const distance = 400;
    camera.position.set(120, distance * Math.sin(angle), distance * Math.cos(angle));
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 조명 설정
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(-100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const tileSize = 10;
    const mapWidth = 30;
    const mapHeight = 30;

    const mapData = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    const materials = {
      grass: new THREE.MeshLambertMaterial({ color: 0x4caf50 }),
      building: new THREE.MeshLambertMaterial({ color: 0x8d6e63 }),
      water: new THREE.MeshLambertMaterial({ color: 0x2196f3 }),
      sand: new THREE.MeshLambertMaterial({ color: 0xffc107 }),
      forest: new THREE.MeshLambertMaterial({ color: 0x2e7d32 }),
      ground: new THREE.MeshLambertMaterial({ color: 0x967969 }),
    };

    const groundThickness = 200;
    const groundGeometry = new THREE.BoxGeometry(mapWidth * tileSize, groundThickness, mapHeight * tileSize);
    const ground = new THREE.Mesh(groundGeometry, materials.ground);
    ground.position.y = -groundThickness / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const buildings: THREE.Mesh[] = [];

    const createMap = (bookModel: THREE.Group | null) => {
      for (let x = 0; x < mapWidth; x++) {
        for (let z = 0; z < mapHeight; z++) {
          const tileType = mapData[z][x];
          let height = 0.5;
          let material = materials.grass;

          if (tileType === 1 && bookModel) {
            const modelClone = bookModel.clone();
            modelClone.scale.set(50, 50, 50);
            modelClone.position.set(
              (x - mapWidth / 2) * tileSize + tileSize / 2,
              0.3,
              (z - mapHeight / 2) * tileSize + tileSize / 2
            );
            modelClone.castShadow = true;
            modelClone.receiveShadow = true;
            scene.add(modelClone);
            continue;
          }

          switch (tileType) {
            case 2: material = materials.building; height = 12; break;
            case 3: material = materials.water; height = 0.2; break;
            case 4: material = materials.sand; height = 0.4; break;
            case 5: material = materials.forest; height = 6; break;
          }

          const geometry = new THREE.BoxGeometry(tileSize, height, tileSize);
          const tile = new THREE.Mesh(geometry, material);

          tile.position.set(
            (x - mapWidth / 2) * tileSize + tileSize / 2,
            height / 2,
            (z - mapHeight / 2) * tileSize + tileSize / 2
          );

          if (tileType === 2) {
            tile.userData = { id: `building_${x}_${z}`, type: 'building' };
            buildings.push(tile);
          }

          if (tileType === 2 || tileType === 5) {
            tile.castShadow = true;
          }
          tile.receiveShadow = true;

          scene.add(tile);
        }
      }
    };

    const loader = new GLTFLoader();
    loader.load(
      "/assets/book-many.glb",
      (gltf) => {
        createMap(gltf.scene);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model:", error);
        createMap(null); // 모델 로딩 실패 시 모델 없이 맵 생성
      }
    );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(buildings);

      if (intersects.length > 0) {
        const intersected = intersects[0].object as THREE.Mesh;
        if (intersected.userData.type === 'building') {
          setPopup({
            x: event.clientX,
            y: event.clientY,
            text: `ID: ${intersected.userData.id}`,
          });
        }
      }
    };

    currentMount.addEventListener("click", onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      currentMount.removeEventListener("click", onClick);
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