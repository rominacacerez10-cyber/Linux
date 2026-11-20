import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface CarProps {
  frame: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  neonColor?: string;
  speed?: number;
  driftAngle?: number;
  suspensionBounce?: boolean;
  looseParts?: boolean;
  crashOffset?: number;
}

export const Car: React.FC<CarProps> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#ff2e93',
  neonColor = '#00e5ff',
  speed = 1.0,
  driftAngle = 0,
  suspensionBounce = true,
  looseParts = false,
  crashOffset = 0,
}) => {
  // Rotación continua de ruedas según avance
  const wheelRotation = frame * speed * 0.45;
  const bounceY = suspensionBounce ? Math.sin(frame * 0.7) * 0.03 : 0;

  // Materiales compartidos PBR estilizados (lacado deportivo, rines metálicos, neón emissive)
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.24,
        metalness: 0.82,
        flatShading: true,
      }),
    [color]
  );
  const cabinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#06030c',
        roughness: 0.08,
        metalness: 0.95,
        flatShading: true,
      }),
    []
  );
  const wheelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#16141e',
        roughness: 0.8,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: neonColor,
        emissive: neonColor,
        emissiveIntensity: 2.4,
        roughness: 0.2,
        metalness: 0.7,
      }),
    [neonColor]
  );
  const headLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 3.5,
        roughness: 0.1,
      }),
    []
  );
  const brakeLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff003c',
        emissive: '#ff003c',
        emissiveIntensity: 3.2,
        roughness: 0.1,
      }),
    []
  );
  const underglowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: neonColor,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      }),
    [neonColor]
  );

  // Geometrías primitivas low poly
  const wheelGeo = useMemo(() => new THREE.CylinderGeometry(0.38, 0.38, 0.3, 12), []);
  const wheelRimGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, 0.32, 8), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Grupo del auto con inclinación de derrape y rebote de amortiguación */}
      <group
        rotation={[0, driftAngle, 0]}
        position={[0, bounceY, 0]}
      >
        {/* Carrocería base */}
        <mesh position={[0, 0.42, 0]} material={bodyMat}>
          <boxGeometry args={[1.9, 0.38, 4.3]} />
        </mesh>

        {/* Nariz inclinada delantera aerodinámica */}
        <mesh
          position={[0, 0.36, -2.1]}
          rotation={[0.15, 0, 0]}
          material={bodyMat}
        >
          <boxGeometry args={[1.82, 0.26, 0.9]} />
        </mesh>

        {/* Cabina / techo */}
        <mesh position={[0, 0.78, -0.2]} material={cabinMat}>
          <boxGeometry args={[1.45, 0.44, 2.1]} />
        </mesh>

        {/* Alerón deportivo trasero (se desprende si looseParts es true) */}
        <group
          position={[
            looseParts ? crashOffset * 0.8 : 0,
            0.8 + (looseParts ? crashOffset * 1.2 : 0),
            1.85 + (looseParts ? crashOffset * 1.5 : 0),
          ]}
          rotation={[looseParts ? crashOffset * 2 : 0, 0, looseParts ? crashOffset * 1.5 : 0]}
        >
          <mesh material={bodyMat} position={[-0.65, -0.15, 0]}>
            <boxGeometry args={[0.08, 0.3, 0.15]} />
          </mesh>
          <mesh material={bodyMat} position={[0.65, -0.15, 0]}>
            <boxGeometry args={[0.08, 0.3, 0.15]} />
          </mesh>
          <mesh material={bodyMat} position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.08, 0.4]} />
          </mesh>
        </group>

        {/* Parachoques delantero / pieza suelta en choque */}
        {looseParts && (
          <group
            position={[crashOffset * -0.6, 0.35 + crashOffset * 0.9, -2.6 - crashOffset * 2.0]}
            rotation={[crashOffset * 3, crashOffset * 1.5, 0]}
          >
            <mesh material={bodyMat}>
              <boxGeometry args={[1.7, 0.22, 0.25]} />
            </mesh>
          </group>
        )}

        {/* Faros delanteros emissive */}
        <mesh position={[-0.68, 0.45, -2.54]} material={headLightMat}>
          <boxGeometry args={[0.35, 0.12, 0.08]} />
        </mesh>
        <mesh position={[0.68, 0.45, -2.54]} material={headLightMat}>
          <boxGeometry args={[0.35, 0.12, 0.08]} />
        </mesh>

        {/* Luces de freno traseras emissive neón */}
        <mesh position={[-0.68, 0.46, 2.16]} material={brakeLightMat}>
          <boxGeometry args={[0.42, 0.12, 0.08]} />
        </mesh>
        <mesh position={[0.68, 0.46, 2.16]} material={brakeLightMat}>
          <boxGeometry args={[0.42, 0.12, 0.08]} />
        </mesh>
        {/* Barra continua trasera estilo synthwave */}
        <mesh position={[0, 0.46, 2.16]} material={brakeLightMat}>
          <boxGeometry args={[0.9, 0.04, 0.08]} />
        </mesh>

        {/* Underglow de neón en el chasis */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} material={underglowMat}>
          <planeGeometry args={[1.7, 3.8]} />
        </mesh>
        <pointLight
          position={[0, 0.22, 0]}
          color={neonColor}
          intensity={2.2}
          distance={7}
          decay={2}
        />

        {/* Ruedas con rotación y rines de neón */}
        {/* Delantera Izquierda */}
        <group position={[-0.98, 0.38, -1.35]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={wheelGeo} material={wheelMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={wheelRimGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
        </group>

        {/* Delantera Derecha */}
        <group position={[0.98, 0.38, -1.35]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh geometry={wheelGeo} material={wheelMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={wheelRimGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
        </group>

        {/* Trasera Izquierda */}
        <group position={[-0.98, 0.38, 1.35]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={wheelGeo} material={wheelMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={wheelRimGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
        </group>

        {/* Trasera Derecha */}
        <group position={[0.98, 0.38, 1.35]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh geometry={wheelGeo} material={wheelMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={wheelRimGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
        </group>
      </group>
    </group>
  );
};
