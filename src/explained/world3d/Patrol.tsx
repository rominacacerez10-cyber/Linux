import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface PatrolProps {
  frame: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
}

export const Patrol: React.FC<PatrolProps> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  speed = 1.2,
}) => {
  const wheelRotation = frame * speed * 0.45;

  // Barra policial alternando cada 4 frames
  const isRed = Math.floor(frame / 4) % 2 === 0;

  // Materiales PBR
  const blackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090812',
        roughness: 0.32,
        metalness: 0.65,
        flatShading: true,
      }),
    []
  );
  const whiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0f0fa',
        roughness: 0.28,
        metalness: 0.45,
        flatShading: true,
      }),
    []
  );
  const cabinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080512',
        roughness: 0.08,
        metalness: 0.95,
        flatShading: true,
      }),
    []
  );
  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15131b',
        roughness: 0.8,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );
  const rimSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#22202a',
        roughness: 0.4,
        metalness: 0.8,
        flatShading: true,
      }),
    []
  );
  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.15,
        metalness: 0.95,
      }),
    []
  );

  const headLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 4.0,
        roughness: 0.1,
      }),
    []
  );

  const sirenRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isRed ? '#ff0033' : '#330009',
        emissive: isRed ? '#ff0033' : '#110002',
        emissiveIntensity: isRed ? 4.5 : 0.2,
        roughness: 0.1,
      }),
    [isRed]
  );

  const sirenBlueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: !isRed ? '#00e5ff' : '#002033',
        emissive: !isRed ? '#00e5ff' : '#000814',
        emissiveIntensity: !isRed ? 4.5 : 0.2,
        roughness: 0.1,
      }),
    [isRed]
  );

  const brakeLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff0033',
        emissive: '#ff0033',
        emissiveIntensity: 4.2,
        roughness: 0.08,
        toneMapped: false,
      }),
    []
  );
  const beamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#eaf7ff',
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );
  const brakeTrailMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff0033',
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Geometrías
  const tireGeo = useMemo(() => new THREE.CylinderGeometry(0.42, 0.42, 0.32, 16), []);
  const rimGeo = useMemo(() => new THREE.CylinderGeometry(0.28, 0.28, 0.34, 12), []);
  const chromeCapGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.12, 0.36, 10), []);
  const spokeGeo = useMemo(() => new THREE.BoxGeometry(0.44, 0.05, 0.35), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Chasis principal blanco con puertas */}
      <mesh position={[0, 0.46, 0]} material={whiteMat}>
        <boxGeometry args={[1.96, 0.44, 4.5]} />
      </mesh>

      {/* Capó delantero negro con caída aerodinámica */}
      <mesh position={[0, 0.52, -1.4]} rotation={[0.1, 0, 0]} material={blackMat}>
        <boxGeometry args={[1.92, 0.34, 1.7]} />
      </mesh>

      {/* Maletero trasero negro */}
      <mesh position={[0, 0.52, 1.5]} rotation={[-0.08, 0, 0]} material={blackMat}>
        <boxGeometry args={[1.92, 0.36, 1.5]} />
      </mesh>

      {/* Barra de empuje policial delantera (Push bumper / Ram) */}
      <group position={[0, 0.4, -2.35]}>
        <mesh material={blackMat} position={[-0.45, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.42, 0.12]} />
        </mesh>
        <mesh material={blackMat} position={[0.45, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.42, 0.12]} />
        </mesh>
        <mesh material={blackMat} position={[0, 0.2, 0]}>
          <boxGeometry args={[1.1, 0.08, 0.1]} />
        </mesh>
        {/* Luces estroboscópicas de parrilla */}
        <mesh position={[-0.25, 0.1, 0.06]} material={sirenRedMat}>
          <boxGeometry args={[0.18, 0.08, 0.04]} />
        </mesh>
        <mesh position={[0.25, 0.1, 0.06]} material={sirenBlueMat}>
          <boxGeometry args={[0.18, 0.08, 0.04]} />
        </mesh>
      </group>

      {/* Parabrisas delantero inclinado */}
      <mesh position={[0, 0.84, -0.6]} rotation={[0.45, 0, 0]} material={cabinMat}>
        <boxGeometry args={[1.56, 0.42, 1.0]} />
      </mesh>

      {/* Techo de cabina */}
      <mesh position={[0, 1.0, 0.0]} material={whiteMat}>
        <boxGeometry args={[1.5, 0.1, 1.4]} />
      </mesh>

      {/* Luneta trasera inclinada */}
      <mesh position={[0, 0.84, 0.7]} rotation={[-0.4, 0, 0]} material={cabinMat}>
        <boxGeometry args={[1.54, 0.42, 0.9]} />
      </mesh>

      {/* Ventanillas laterales oscuras */}
      <mesh position={[-0.765, 0.88, 0.05]} material={cabinMat}>
        <boxGeometry args={[0.02, 0.3, 1.25]} />
      </mesh>
      <mesh position={[0.765, 0.88, 0.05]} material={cabinMat}>
        <boxGeometry args={[0.02, 0.3, 1.25]} />
      </mesh>

      {/* Espejos retrovisores de patrulla */}
      <group position={[-1.02, 0.78, -0.7]} rotation={[0, 0.16, 0]}>
        <mesh material={blackMat}>
          <boxGeometry args={[0.14, 0.04, 0.06]} />
        </mesh>
        <mesh position={[-0.06, 0.03, 0]} material={blackMat}>
          <boxGeometry args={[0.18, 0.09, 0.12]} />
        </mesh>
      </group>
      <group position={[1.02, 0.78, -0.7]} rotation={[0, -0.16, 0]}>
        <mesh material={blackMat}>
          <boxGeometry args={[0.14, 0.04, 0.06]} />
        </mesh>
        <mesh position={[0.06, 0.03, 0]} material={blackMat}>
          <boxGeometry args={[0.18, 0.09, 0.12]} />
        </mesh>
      </group>

      {/* Separación de puertas y faldón lateral */}
      <mesh position={[-0.985, 0.5, 0.2]} material={blackMat}>
        <boxGeometry args={[0.02, 0.3, 0.5]} />
      </mesh>
      <mesh position={[0.985, 0.5, 0.2]} material={blackMat}>
        <boxGeometry args={[0.02, 0.3, 0.5]} />
      </mesh>
      <mesh position={[-0.985, 0.34, 0]} material={blackMat}>
        <boxGeometry args={[0.05, 0.1, 2.2]} />
      </mesh>
      <mesh position={[0.985, 0.34, 0]} material={blackMat}>
        <boxGeometry args={[0.05, 0.1, 2.2]} />
      </mesh>

      {/* Faros delanteros luminosos */}
      <mesh position={[-0.72, 0.5, -2.26]} material={headLightMat}>
        <boxGeometry args={[0.38, 0.14, 0.08]} />
      </mesh>
      <mesh position={[0.72, 0.5, -2.26]} material={headLightMat}>
        <boxGeometry args={[0.38, 0.14, 0.08]} />
      </mesh>

      {/* Luces traseras rojas y estela de persecución */}
      <mesh position={[-0.72, 0.56, 2.27]} material={brakeLightMat}>
        <boxGeometry args={[0.36, 0.16, 0.07]} />
      </mesh>
      <mesh position={[0.72, 0.56, 2.27]} material={brakeLightMat}>
        <boxGeometry args={[0.36, 0.16, 0.07]} />
      </mesh>
      <mesh position={[0, 0.56, 2.27]} material={brakeLightMat}>
        <boxGeometry args={[1.66, 0.06, 0.06]} />
      </mesh>
      <mesh position={[-0.72, 0.57, 3.1]} material={brakeTrailMat}>
        <boxGeometry args={[0.16, 0.035, 1.9]} />
      </mesh>
      <mesh position={[0.72, 0.57, 3.1]} material={brakeTrailMat}>
        <boxGeometry args={[0.16, 0.035, 1.9]} />
      </mesh>

      {/* Haces de los faros delanteros */}
      <mesh position={[-0.72, 0.5, -2.55]} rotation={[-Math.PI / 2, 0, 0]} material={beamMat}>
        <coneGeometry args={[0.4, 2.2, 12, 1, true]} />
      </mesh>
      <mesh position={[0.72, 0.5, -2.55]} rotation={[-Math.PI / 2, 0, 0]} material={beamMat}>
        <coneGeometry args={[0.4, 2.2, 12, 1, true]} />
      </mesh>

      {/* Barra de Sirena policial estilizada de bajo perfil en el techo */}
      <group position={[0, 1.12, 0.0]}>
        {/* Base de montaje aerodinámica */}
        <mesh material={blackMat}>
          <boxGeometry args={[1.2, 0.05, 0.26]} />
        </mesh>
        {/* Luz roja (lado izquierdo) */}
        <mesh position={[-0.34, 0.06, 0]} material={sirenRedMat}>
          <boxGeometry args={[0.48, 0.1, 0.2]} />
        </mesh>
        {/* Luz azul (lado derecho) */}
        <mesh position={[0.34, 0.06, 0]} material={sirenBlueMat}>
          <boxGeometry args={[0.48, 0.1, 0.2]} />
        </mesh>
        {/* Luz blanca central / altavoz */}
        <mesh position={[0, 0.06, 0]} material={chromeMat}>
          <boxGeometry args={[0.16, 0.09, 0.22]} />
        </mesh>

        {/* Foco de persecución en el pilar A (lado conductor) */}
        <group position={[-0.82, -0.15, -0.45]}>
          <mesh material={chromeMat} rotation={[0.3, -0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.14, 8]} />
          </mesh>
          <mesh position={[-0.04, 0.02, -0.06]} material={headLightMat}>
            <circleGeometry args={[0.07, 8]} />
          </mesh>
        </group>

        {/* Luces puntuales estroboscópicas sincronizadas de gran alcance */}
        <pointLight
          position={[-1.2, 0.4, 0]}
          color="#ff0033"
          intensity={isRed ? 5.5 : 0.3}
          distance={35}
          decay={2}
        />
        <pointLight
          position={[1.2, 0.4, 0]}
          color="#00e5ff"
          intensity={!isRed ? 5.5 : 0.3}
          distance={35}
          decay={2}
        />
      </group>

      {/* 4 Ruedas de patrulla estilo Police Pursuit con tapacubos cromados */}
      <group position={[-1.02, 0.42, -1.35]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={tireGeo} material={tireMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={rimGeo} material={rimSteelMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[wheelRotation + Math.PI / 2, 0, 0]} />
        <mesh geometry={chromeCapGeo} material={chromeMat} rotation={[wheelRotation, 0, 0]} />
      </group>
      <group position={[1.02, 0.42, -1.35]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={tireGeo} material={tireMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={rimGeo} material={rimSteelMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[-wheelRotation + Math.PI / 2, 0, 0]} />
        <mesh geometry={chromeCapGeo} material={chromeMat} rotation={[-wheelRotation, 0, 0]} />
      </group>
      <group position={[-1.02, 0.42, 1.35]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={tireGeo} material={tireMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={rimGeo} material={rimSteelMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[wheelRotation + Math.PI / 2, 0, 0]} />
        <mesh geometry={chromeCapGeo} material={chromeMat} rotation={[wheelRotation, 0, 0]} />
      </group>
      <group position={[1.02, 0.42, 1.35]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={tireGeo} material={tireMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={rimGeo} material={rimSteelMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[-wheelRotation, 0, 0]} />
        <mesh geometry={spokeGeo} material={chromeMat} rotation={[-wheelRotation + Math.PI / 2, 0, 0]} />
        <mesh geometry={chromeCapGeo} material={chromeMat} rotation={[-wheelRotation, 0, 0]} />
      </group>
    </group>
  );
};
