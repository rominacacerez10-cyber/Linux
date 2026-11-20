import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { random } from 'remotion';

interface CityProps {
  frame: number;
  speed?: number;
}

export const City: React.FC<CityProps> = ({ frame, speed = 0.8 }) => {
  const buildingMeshRef = useRef<THREE.InstancedMesh>(null);
  const windowMeshRef = useRef<THREE.InstancedMesh>(null);
  const lampPoleMeshRef = useRef<THREE.InstancedMesh>(null);
  const lampHeadMeshRef = useRef<THREE.InstancedMesh>(null);
  const roadDashMeshRef = useRef<THREE.InstancedMesh>(null);
  const neonStripMeshRef = useRef<THREE.InstancedMesh>(null);

  // Número de edificios por lado
  const buildingsPerSide = 16;
  const totalBuildings = buildingsPerSide * 2;
  const buildingSpacing = 22;
  const totalLength = buildingsPerSide * buildingSpacing;

  // El mundo avanza en Z de forma continua y suave
  const offsetZ = (frame * speed) % totalLength;

  // Geometrías y materiales compartidos (PBR estilizado)
  const buildingGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const buildingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1b0a2e',
        emissive: '#120022',
        emissiveIntensity: 0.55,
        roughness: 0.58,
        metalness: 0.5,
        flatShading: true,
      }),
    []
  );

  // Ventana con cristal y emisión neón (color blanco base: el tinte viene por instancia)
  const windowGeo = useMemo(() => new THREE.PlaneGeometry(0.62, 0.82), []);
  const windowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        toneMapped: false,
      }),
    []
  );

  // Farolas en la acera
  const lampPoleGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.1, 5.2, 8), []);
  const lampPoleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#181424',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const lampHeadGeo = useMemo(() => new THREE.BoxGeometry(0.4, 0.12, 0.28), []);
  const lampHeadMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff3c4',
        emissive: '#ffe066',
        emissiveIntensity: 5,
        roughness: 0.05,
        toneMapped: false,
      }),
    []
  );

  // Líneas discontinuas de la carretera
  const roadDashGeo = useMemo(() => new THREE.PlaneGeometry(0.3, 4.0), []);
  const roadDashMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffe066',
        emissive: '#ffbe53',
        emissiveIntensity: 2.6,
        roughness: 0.2,
        toneMapped: false,
      }),
    []
  );

  // Tiras de neón verticales/horizontales en las fachadas
  const neonStripGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const neonStripMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        toneMapped: false,
      }),
    []
  );

  // Parámetros de ventanas por edificio (matriz 4x8 = 32 ventanas)
  const windowsPerBuilding = 32;
  const totalWindows = totalBuildings * windowsPerBuilding;

  // Farolas: 1 por edificio = totalBuildings farolas
  const totalLamps = totalBuildings;

  // Tiras de neón: 1 horizontal + 1 vertical por edificio
  const totalNeonStrips = totalBuildings * 2;

  // Líneas discontinuas: una cada 8 metros a lo largo de totalLength
  const dashSpacing = 8;
  const totalDashes = Math.floor(totalLength / dashSpacing);

  useLayoutEffect(() => {
    if (
      !buildingMeshRef.current ||
      !windowMeshRef.current ||
      !lampPoleMeshRef.current ||
      !lampHeadMeshRef.current ||
      !roadDashMeshRef.current ||
      !neonStripMeshRef.current
    )
      return;

    const dummy = new THREE.Object3D();

    let bIdx = 0;
    let wIdx = 0;
    let lIdx = 0;
    let nIdx = 0;

    // Colores alternados para ventanas de edificios (ámbar cálido, cian y magenta)
    const windowColors = [
      new THREE.Color('#ffbe53'),
      new THREE.Color('#00e5ff'),
      new THREE.Color('#ff2e93'),
      new THREE.Color('#ffe8a3'),
      new THREE.Color('#ff7a3d'),
    ];
    const neonColors = [
      new THREE.Color('#ff2e93'),
      new THREE.Color('#00e5ff'),
      new THREE.Color('#ff7a3d'),
      new THREE.Color('#ffd166'),
    ];

    for (let side = 0; side < 2; side++) {
      const sideSign = side === 0 ? -1 : 1;
      const posX = sideSign * (18 + side * 2);
      const curbX = sideSign * 8.8;

      for (let i = 0; i < buildingsPerSide; i++) {
        // Z calculada cíclica
        const rawZ = i * buildingSpacing - offsetZ;
        const cycledZ =
          ((rawZ % totalLength) + totalLength) % totalLength - totalLength / 2;

        const seed = `bldg-${side}-${i}`;
        const width = 10 + random(`${seed}-w`) * 6;
        const height = 26 + random(`${seed}-h`) * 45;
        const depth = 12 + random(`${seed}-d`) * 8;

        // 1. Edificio
        dummy.position.set(posX + (sideSign * width) / 2, height / 2, cycledZ);
        dummy.scale.set(width, height, depth);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        buildingMeshRef.current.setMatrixAt(bIdx, dummy.matrix);

        // 2. Rejilla de ventanas iluminadas en la fachada que mira a la calle
        const faceX = posX;
        const faceOffset = sideSign < 0 ? 0.06 : -0.06;
        const cols = 4;
        const rows = 8;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const winY = 3.5 + (row / (rows - 1)) * (height * 0.88);
            const winZ =
              cycledZ - depth * 0.4 + (col / (cols - 1)) * (depth * 0.8);

            dummy.position.set(faceX + faceOffset, winY, winZ);
            dummy.rotation.set(0, sideSign > 0 ? -Math.PI / 2 : Math.PI / 2, 0);
            dummy.scale.set(1.15, 1.15, 1.15);
            dummy.updateMatrix();
            windowMeshRef.current.setMatrixAt(wIdx, dummy.matrix);

            // Variación sutil de color de ventana
            const colorPick =
              windowColors[Math.floor(random(`${seed}-col-${row}-${col}`) * windowColors.length)];
            windowMeshRef.current.setColorAt(wIdx, colorPick);

            wIdx++;
          }
        }

        // 3. Tira de neón horizontal en la azotea
        const neonColor =
          neonColors[Math.floor(random(`${seed}-neon`) * neonColors.length)];
        dummy.position.set(faceX + faceOffset, height * 0.975, cycledZ);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.14, 0.14, depth * 0.92);
        dummy.updateMatrix();
        neonStripMeshRef.current.setMatrixAt(nIdx, dummy.matrix);
        neonStripMeshRef.current.setColorAt(nIdx, neonColor);
        nIdx++;

        // 3b. Tira vertical de neón en la esquina frontal de la fachada
        dummy.position.set(
          faceX + faceOffset,
          height * 0.48,
          cycledZ - depth * 0.46
        );
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.1, height * 0.76, 0.1);
        dummy.updateMatrix();
        neonStripMeshRef.current.setMatrixAt(nIdx, dummy.matrix);
        neonStripMeshRef.current.setColorAt(nIdx, neonColor);
        nIdx++;

        // 4. Farolas en la acera
        dummy.position.set(curbX, 2.6, cycledZ);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        lampPoleMeshRef.current.setMatrixAt(lIdx, dummy.matrix);

        // Cabezal de la farola iluminando hacia la calle
        dummy.position.set(curbX - sideSign * 0.5, 5.15, cycledZ);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        lampHeadMeshRef.current.setMatrixAt(lIdx, dummy.matrix);

        lIdx++;
        bIdx++;
      }
    }

    // 5. Líneas discontinuas de la carretera (centro del asfalto)
    for (let d = 0; d < totalDashes; d++) {
      const dashRawZ = d * dashSpacing - offsetZ;
      const dashCycledZ =
        ((dashRawZ % totalLength) + totalLength) % totalLength - totalLength / 2;

      dummy.position.set(0, 0.02, dashCycledZ);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      roadDashMeshRef.current.setMatrixAt(d, dummy.matrix);
    }

    buildingMeshRef.current.instanceMatrix.needsUpdate = true;
    windowMeshRef.current.instanceMatrix.needsUpdate = true;
    if (windowMeshRef.current.instanceColor) {
      windowMeshRef.current.instanceColor.needsUpdate = true;
    }
    lampPoleMeshRef.current.instanceMatrix.needsUpdate = true;
    lampHeadMeshRef.current.instanceMatrix.needsUpdate = true;
    roadDashMeshRef.current.instanceMatrix.needsUpdate = true;
    neonStripMeshRef.current.instanceMatrix.needsUpdate = true;
    if (neonStripMeshRef.current.instanceColor) {
      neonStripMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [offsetZ, buildingsPerSide, totalLength, buildingSpacing, totalDashes, dashSpacing]);

  return (
    <group>
      {/* Edificios art déco */}
      <instancedMesh
        ref={buildingMeshRef}
        args={[buildingGeo, buildingMat, totalBuildings]}
      />

      {/* Rejilla densa de ventanas emissive */}
      <instancedMesh
        ref={windowMeshRef}
        args={[windowGeo, windowMat, totalWindows]}
      />

      {/* Neones de fachada y azotea */}
      <instancedMesh
        ref={neonStripMeshRef}
        args={[neonStripGeo, neonStripMat, totalNeonStrips]}
      />

      {/* Postes de farolas */}
      <instancedMesh
        ref={lampPoleMeshRef}
        args={[lampPoleGeo, lampPoleMat, totalLamps]}
      />

      {/* Cabezales luminosos de farolas */}
      <instancedMesh
        ref={lampHeadMeshRef}
        args={[lampHeadGeo, lampHeadMat, totalLamps]}
      />

      {/* Líneas discontinuas centrales de la calzada */}
      <instancedMesh
        ref={roadDashMeshRef}
        args={[roadDashGeo, roadDashMat, totalDashes]}
      />

      {/* Carretera principal estilo asfalto húmedo con reflejos neón */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 500]} />
        <meshStandardMaterial color="#090412" roughness={0.3} metalness={0.65} />
      </mesh>

      {/* Líneas laterales continuas de borde de carril (Cyan neón) */}
      <mesh position={[-7.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 500]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.0} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh position={[7.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 500]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.0} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Aceras peatonales elevadas con bordillo */}
      <mesh position={[-9.5, 0.18, 0]}>
        <boxGeometry args={[2.2, 0.36, 500]} />
        <meshStandardMaterial
          color="#1e182e"
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>
      <mesh position={[9.5, 0.18, 0]}>
        <boxGeometry args={[2.2, 0.36, 500]} />
        <meshStandardMaterial
          color="#1e182e"
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>

      {/* Franja neón magenta en el filo del bordillo */}
      <mesh position={[-8.38, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.1, 500]} />
        <meshStandardMaterial color="#ff2e93" emissive="#ff2e93" emissiveIntensity={2.5} roughness={0.1} toneMapped={false} />
      </mesh>
      <mesh position={[8.38, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.1, 500]} />
        <meshStandardMaterial color="#ff2e93" emissive="#ff2e93" emissiveIntensity={2.5} roughness={0.1} toneMapped={false} />
      </mesh>

      {/* Sol gigante art déco al fondo */}
      <group position={[0, 24, -220]}>
        <mesh>
          <circleGeometry args={[42, 32]} />
          <meshBasicMaterial color="#ff7a3d" toneMapped={false} />
        </mesh>
        {/* Rayas horizontales de recorte del sol synthwave */}
        {[-8, -2, 4, 10, 16].map((stripY, idx) => (
          <mesh key={`sun-strip-${idx}`} position={[0, stripY, 0.2]}>
            <planeGeometry args={[90, 2.2 + idx * 0.4]} />
            <meshBasicMaterial color="#2a0845" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
