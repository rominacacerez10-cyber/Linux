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
  const wheelRotation = frame * speed * 0.5;

  // Barra policial alternando cada 4 frames
  const isRed = Math.floor(frame / 4) % 2 === 0;

  // Materiales
  const blackMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#090812', flatShading: true }),
    []
  );
  const whiteMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#e6e6f0', flatShading: true }),
    []
  );
  const wheelMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#161520', flatShading: true }),
    []
  );

  const sirenRedMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: isRed ? '#ff0033' : '#330009',
      }),
    [isRed]
  );

  const sirenBlueMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: !isRed ? '#00e5ff' : '#002033',
      }),
    [isRed]
  );

  const wheelGeo = useMemo(() => new THREE.CylinderGeometry(0.4, 0.4, 0.32, 12), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Chasis principal (blanco) */}
      <mesh position={[0, 0.46, 0]} material={whiteMat}>
        <boxGeometry args={[1.95, 0.44, 4.4]} />
      </mesh>

      {/* Capó delantero y maletero traseros negros (estilo patrulla) */}
      <mesh position={[0, 0.52, -1.35]} material={blackMat}>
        <boxGeometry args={[1.92, 0.38, 1.6]} />
      </mesh>
      <mesh position={[0, 0.52, 1.45]} material={blackMat}>
        <boxGeometry args={[1.92, 0.38, 1.4]} />
      </mesh>

      {/* Cabina / Techo con ventanas tintadas */}
      <mesh position={[0, 0.88, -0.05]} material={blackMat}>
        <boxGeometry args={[1.5, 0.48, 1.95]} />
      </mesh>

      {/* Barra de Sirena en el techo */}
      <group position={[0, 1.2, -0.05]}>
        {/* Base montaje */}
        <mesh material={blackMat}>
          <boxGeometry args={[1.1, 0.06, 0.22]} />
        </mesh>
        {/* Luz roja (lado izquierdo) */}
        <mesh position={[-0.32, 0.08, 0]} material={sirenRedMat}>
          <boxGeometry args={[0.42, 0.1, 0.16]} />
        </mesh>
        {/* Luz azul (lado derecho) */}
        <mesh position={[0.32, 0.08, 0]} material={sirenBlueMat}>
          <boxGeometry args={[0.42, 0.1, 0.16]} />
        </mesh>

        {/* Point Lights dinámicas que iluminan los edificios cercanos */}
        <pointLight
          position={[-0.8, 0.4, 0]}
          color="#ff0033"
          intensity={isRed ? 4.5 : 0.2}
          distance={28}
          decay={2}
        />
        <pointLight
          position={[0.8, 0.4, 0]}
          color="#00e5ff"
          intensity={!isRed ? 4.5 : 0.2}
          distance={28}
          decay={2}
        />
      </group>

      {/* Ruedas */}
      <group position={[-1.02, 0.4, -1.3]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={wheelGeo} material={wheelMat} rotation={[wheelRotation, 0, 0]} />
      </group>
      <group position={[1.02, 0.4, -1.3]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={wheelGeo} material={wheelMat} rotation={[-wheelRotation, 0, 0]} />
      </group>
      <group position={[-1.02, 0.4, 1.3]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={wheelGeo} material={wheelMat} rotation={[wheelRotation, 0, 0]} />
      </group>
      <group position={[1.02, 0.4, 1.3]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={wheelGeo} material={wheelMat} rotation={[-wheelRotation, 0, 0]} />
      </group>
    </group>
  );
};
