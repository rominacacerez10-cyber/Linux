import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { random } from 'remotion';

interface CityProps {
  frame: number;
  speed?: number;
}

export const City: React.FC<CityProps> = ({ frame, speed = 0.8 }) => {
  const buildingMeshRef = useRef<THREE.InstancedMesh>(null);
  const windowMeshRef = useRef<THREE.InstancedMesh>(null);

  // Número de edificios por lado
  const buildingsPerSide = 16;
  const totalBuildings = buildingsPerSide * 2;
  const buildingSpacing = 22;
  const totalLength = buildingsPerSide * buildingSpacing;

  // El mundo avanza en Z de forma continua y suave
  const offsetZ = (frame * speed) % totalLength;

  // Geometrías y materiales compartidos (low poly, flat shading PBR)
  const buildingGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const buildingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#120822',
        roughness: 0.68,
        metalness: 0.35,
        flatShading: true,
      }),
    []
  );

  const windowGeo = useMemo(() => new THREE.PlaneGeometry(0.8, 1.2), []);
  const windowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff2e93',
        emissive: '#ff2e93',
        emissiveIntensity: 2.6,
        roughness: 0.1,
      }),
    []
  );

  // Cantidad fija de ventanas por edificio para el InstancedMesh
  const windowsPerBuilding = 8;
  const totalWindows = totalBuildings * windowsPerBuilding;

  useEffect(() => {
    if (!buildingMeshRef.current || !windowMeshRef.current) return;

    const dummyB = new THREE.Object3D();
    const dummyW = new THREE.Object3D();

    let bIdx = 0;
    let wIdx = 0;

    for (let side = 0; side < 2; side++) {
      const sideSign = side === 0 ? -1 : 1;
      const posX = sideSign * (18 + side * 2);

      for (let i = 0; i < buildingsPerSide; i++) {
        // Z calculada cíclica
        const rawZ = i * buildingSpacing - offsetZ;
        const cycledZ = ((rawZ % totalLength) + totalLength) % totalLength - totalLength / 2;

        const seed = `bldg-${side}-${i}`;
        const width = 10 + random(`${seed}-w`) * 6;
        const height = 24 + random(`${seed}-h`) * 45;
        const depth = 12 + random(`${seed}-d`) * 8;

        dummyB.position.set(posX + (sideSign * width) / 2, height / 2, cycledZ);
        dummyB.scale.set(width, height, depth);
        dummyB.rotation.set(0, 0, 0);
        dummyB.updateMatrix();
        buildingMeshRef.current.setMatrixAt(bIdx, dummyB.matrix);

        // Ventanas emissive en la fachada orientada a la avenida
        const faceX = posX + (sideSign > 0 ? 0 : width);
        for (let w = 0; w < windowsPerBuilding; w++) {
          const winY = 4 + (w % 4) * (height / 5);
          const winZ = cycledZ - depth / 3 + ((w % 2) * depth * 2) / 3;

          dummyW.position.set(faceX + (sideSign < 0 ? 0.05 : -0.05), winY, winZ);
          dummyW.rotation.set(0, sideSign > 0 ? -Math.PI / 2 : Math.PI / 2, 0);
          dummyW.scale.set(1.4, 1.4, 1.4);
          dummyW.updateMatrix();
          windowMeshRef.current.setMatrixAt(wIdx, dummyW.matrix);
          wIdx++;
        }

        bIdx++;
      }
    }

    buildingMeshRef.current.instanceMatrix.needsUpdate = true;
    windowMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [offsetZ, buildingsPerSide, totalLength, buildingSpacing]);

  return (
    <group>
      {/* Edificios art déco */}
      <instancedMesh
        ref={buildingMeshRef}
        args={[buildingGeo, buildingMat, totalBuildings]}
      />

      {/* Ventanas emissive neón */}
      <instancedMesh
        ref={windowMeshRef}
        args={[windowGeo, windowMat, totalWindows]}
      />

      {/* Carretera principal estilo asfalto húmedo con reflejos neón */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 500]} />
        <meshStandardMaterial color="#0a0516" roughness={0.32} metalness={0.65} />
      </mesh>

      {/* Línea divisoria central con neón cyan emissive */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 500]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.2} roughness={0.1} />
      </mesh>

      {/* Bordillos / aceras con brillo magenta */}
      <mesh position={[-9.2, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.4, 500]} />
        <meshStandardMaterial color="#ff2e93" emissive="#55002a" emissiveIntensity={0.8} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[9.2, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.4, 500]} />
        <meshStandardMaterial color="#ff2e93" emissive="#55002a" emissiveIntensity={0.8} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Rejilla retro Synthwave a los lados */}
      <gridHelper
        args={[300, 60, '#ff2e93', '#2a0845']}
        position={[0, 0, 0]}
      />

      {/* Sol gigante art déco al fondo */}
      <group position={[0, 24, -220]}>
        <mesh>
          <circleGeometry args={[42, 32]} />
          <meshBasicMaterial color="#ff7a3d" />
        </mesh>
        {/* Rayas horizontales de recorte del sol synthwave */}
        {[-8, -2, 4, 10, 16].map((stripY, idx) => (
          <mesh key={`sun-strip-${idx}`} position={[0, stripY, 0.2]}>
            <planeGeometry args={[90, 2.2 + idx * 0.4]} />
            <meshBasicMaterial color="#2a0845" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
