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
  const bounceY = suspensionBounce ? Math.sin(frame * 0.7) * 0.025 : 0;

  // Materiales compartidos PBR estilizados (lacado deportivo, rines metálicos, neón emissive)
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.22,
        metalness: 0.85,
        flatShading: true,
      }),
    [color]
  );
  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0614',
        roughness: 0.35,
        metalness: 0.7,
        flatShading: true,
      }),
    []
  );
  const cabinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#05020a',
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
        roughness: 0.82,
        metalness: 0.15,
        flatShading: true,
      }),
    []
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: neonColor,
        emissive: neonColor,
        emissiveIntensity: 2.8,
        roughness: 0.15,
        metalness: 0.85,
      }),
    [neonColor]
  );
  const spokeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d0d8e8',
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  );
  const headLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 4.2,
        roughness: 0.05,
      }),
    []
  );
  const brakeLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff003c',
        emissive: '#ff003c',
        emissiveIntensity: 3.8,
        roughness: 0.05,
      }),
    []
  );
  const underglowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: neonColor,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      }),
    [neonColor]
  );
  const beamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#dff6ff',
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );
  const brakeTrailMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff003c',
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Geometrías primitivas detalladas compartidas
  const tireGeo = useMemo(() => new THREE.CylinderGeometry(0.4, 0.4, 0.32, 16), []);
  const rimOuterGeo = useMemo(() => new THREE.CylinderGeometry(0.28, 0.28, 0.34, 12), []);
  const spokeGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.06, 0.33), []);
  const centerCapGeo = useMemo(() => new THREE.CylinderGeometry(0.09, 0.09, 0.35, 8), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Grupo del auto con inclinación de derrape y rebote de amortiguación */}
      <group rotation={[0, driftAngle, 0]} position={[0, bounceY, 0]}>
        {/* Chasis inferior estilizado / Difusor aerodinámico */}
        <mesh position={[0, 0.24, 0]} material={trimMat}>
          <boxGeometry args={[1.94, 0.16, 4.4]} />
        </mesh>

        {/* Carrocería central con cintura esculpida */}
        <mesh position={[0, 0.44, 0]} material={bodyMat}>
          <boxGeometry args={[1.88, 0.32, 4.3]} />
        </mesh>

        {/* Capó delantero en cuña inclinada */}
        <mesh position={[0, 0.46, -1.5]} rotation={[0.14, 0, 0]} material={bodyMat}>
          <boxGeometry args={[1.84, 0.18, 1.4]} />
        </mesh>

        {/* Splitter delantero bajo */}
        <mesh position={[0, 0.18, -2.25]} material={trimMat}>
          <boxGeometry args={[1.92, 0.06, 0.35]} />
        </mesh>

        {/* Parabrisas delantero inclinado aerodinámico */}
        <mesh position={[0, 0.78, -0.65]} rotation={[0.48, 0, 0]} material={cabinMat}>
          <boxGeometry args={[1.5, 0.44, 1.0]} />
        </mesh>

        {/* Techo aerodinámico */}
        <mesh position={[0, 0.94, -0.1]} material={cabinMat}>
          <boxGeometry args={[1.38, 0.12, 1.3]} />
        </mesh>

        {/* Luneta trasera inclinada fastback */}
        <mesh position={[0, 0.76, 0.75]} rotation={[-0.42, 0, 0]} material={cabinMat}>
          <boxGeometry args={[1.42, 0.42, 1.1]} />
        </mesh>

        {/* Deck trasero con tomas de aire */}
        <mesh position={[0, 0.52, 1.6]} rotation={[-0.08, 0, 0]} material={bodyMat}>
          <boxGeometry args={[1.84, 0.22, 1.2]} />
        </mesh>

        {/* Alerón deportivo GT trasero (se desprende si looseParts es true) */}
        <group
          position={[
            looseParts ? crashOffset * 0.8 : 0,
            0.92 + (looseParts ? crashOffset * 1.2 : 0),
            1.9 + (looseParts ? crashOffset * 1.5 : 0),
          ]}
          rotation={[looseParts ? crashOffset * 2 : 0, 0, looseParts ? crashOffset * 1.5 : 0]}
        >
          {/* Soportes del alerón */}
          <mesh material={trimMat} position={[-0.6, -0.15, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.18]} />
          </mesh>
          <mesh material={trimMat} position={[0.6, -0.15, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.18]} />
          </mesh>
          {/* Ala superior aerodinámica con puntas inclinadas */}
          <mesh material={bodyMat} position={[0, 0.04, 0]}>
            <boxGeometry args={[1.88, 0.07, 0.42]} />
          </mesh>
          <mesh material={rimMat} position={[-0.94, 0.08, 0]}>
            <boxGeometry args={[0.06, 0.15, 0.4]} />
          </mesh>
          <mesh material={rimMat} position={[0.94, 0.08, 0]}>
            <boxGeometry args={[0.06, 0.15, 0.4]} />
          </mesh>
        </group>

        {/* Tomas de aire laterales con acento neón */}
        <mesh position={[-0.96, 0.45, 0.4]} material={trimMat}>
          <boxGeometry args={[0.06, 0.22, 0.7]} />
        </mesh>
        <mesh position={[0.96, 0.45, 0.4]} material={trimMat}>
          <boxGeometry args={[0.06, 0.22, 0.7]} />
        </mesh>

        {/* Espejos retrovisores deportivos */}
        <group position={[-0.98, 0.72, -0.72]} rotation={[0, 0.18, 0]}>
          <mesh material={trimMat}>
            <boxGeometry args={[0.16, 0.04, 0.06]} />
          </mesh>
          <mesh position={[-0.06, 0.03, 0]} material={bodyMat}>
            <boxGeometry args={[0.18, 0.09, 0.12]} />
          </mesh>
        </group>
        <group position={[0.98, 0.72, -0.72]} rotation={[0, -0.18, 0]}>
          <mesh material={trimMat}>
            <boxGeometry args={[0.16, 0.04, 0.06]} />
          </mesh>
          <mesh position={[0.06, 0.03, 0]} material={bodyMat}>
            <boxGeometry args={[0.18, 0.09, 0.12]} />
          </mesh>
        </group>

        {/* Costuras de puertas y faldón lateral neón */}
        <mesh position={[-0.955, 0.5, 0.25]} material={trimMat}>
          <boxGeometry args={[0.02, 0.26, 0.55]} />
        </mesh>
        <mesh position={[0.955, 0.5, 0.25]} material={trimMat}>
          <boxGeometry args={[0.02, 0.26, 0.55]} />
        </mesh>
        <mesh position={[-0.97, 0.27, 0.3]} material={rimMat}>
          <boxGeometry args={[0.04, 0.05, 1.5]} />
        </mesh>
        <mesh position={[0.97, 0.27, 0.3]} material={rimMat}>
          <boxGeometry args={[0.04, 0.05, 1.5]} />
        </mesh>

        {/* Parachoques delantero / pieza suelta en choque */}
        {looseParts && (
          <group
            position={[crashOffset * -0.6, 0.35 + crashOffset * 0.9, -2.6 - crashOffset * 2.0]}
            rotation={[crashOffset * 3, crashOffset * 1.5, 0]}
          >
            <mesh material={bodyMat}>
              <boxGeometry args={[1.8, 0.24, 0.3]} />
            </mesh>
          </group>
        )}

        {/* Faros delanteros angulares Cyberpunk / Vice City */}
        <mesh position={[-0.68, 0.48, -2.18]} rotation={[0, -0.12, 0]} material={headLightMat}>
          <boxGeometry args={[0.42, 0.11, 0.1]} />
        </mesh>
        <mesh position={[0.68, 0.48, -2.18]} rotation={[0, 0.12, 0]} material={headLightMat}>
          <boxGeometry args={[0.42, 0.11, 0.1]} />
        </mesh>

        {/* Luces de freno traseras y barra LED continua */}
        <mesh position={[0, 0.52, 2.18]} material={brakeLightMat}>
          <boxGeometry args={[1.82, 0.08, 0.08]} />
        </mesh>
        <mesh position={[-0.72, 0.52, 2.18]} material={brakeLightMat}>
          <boxGeometry args={[0.38, 0.16, 0.09]} />
        </mesh>
        <mesh position={[0.72, 0.52, 2.18]} material={brakeLightMat}>
          <boxGeometry args={[0.38, 0.16, 0.09]} />
        </mesh>

        {/* Haces volumétricos de los faros delanteros */}
        <mesh position={[-0.68, 0.48, -2.45]} rotation={[-Math.PI / 2, 0, 0]} material={beamMat}>
          <coneGeometry args={[0.42, 2.4, 12, 1, true]} />
        </mesh>
        <mesh position={[0.68, 0.48, -2.45]} rotation={[-Math.PI / 2, 0, 0]} material={beamMat}>
          <coneGeometry args={[0.42, 2.4, 12, 1, true]} />
        </mesh>

        {/* Estela roja de luces traseras */}
        <mesh position={[-0.72, 0.53, 3.05]} material={brakeTrailMat}>
          <boxGeometry args={[0.16, 0.035, 1.9]} />
        </mesh>
        <mesh position={[0.72, 0.53, 3.05]} material={brakeTrailMat}>
          <boxGeometry args={[0.16, 0.035, 1.9]} />
        </mesh>
        <pointLight position={[0, 0.55, 2.6]} color="#ff003c" intensity={2.2} distance={9} decay={2} />

        {/* Salidas de escape dobles metálicas */}
        <mesh position={[-0.35, 0.24, 2.22]} rotation={[Math.PI / 2, 0, 0]} material={spokeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 10]} />
        </mesh>
        <mesh position={[0.35, 0.24, 2.22]} rotation={[Math.PI / 2, 0, 0]} material={spokeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 10]} />
        </mesh>

        {/* Underglow de neón en el chasis + luz puntual en el suelo */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} material={underglowMat}>
          <planeGeometry args={[1.75, 4.0]} />
        </mesh>
        <pointLight
          position={[0, 0.22, 0]}
          color={neonColor}
          intensity={2.4}
          distance={8}
          decay={2}
        />

        {/* 4 Ruedas detalladas con neumáticos, rines profundos y radios metálicos */}
        {/* Delantera Izquierda */}
        <group position={[-1.02, 0.4, -1.35]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={tireGeo} material={tireMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={rimOuterGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[wheelRotation + Math.PI / 2, 0, 0]} />
          <mesh geometry={centerCapGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
        </group>

        {/* Delantera Derecha */}
        <group position={[1.02, 0.4, -1.35]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh geometry={tireGeo} material={tireMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={rimOuterGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[-wheelRotation + Math.PI / 2, 0, 0]} />
          <mesh geometry={centerCapGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
        </group>

        {/* Trasera Izquierda */}
        <group position={[-1.02, 0.4, 1.35]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={tireGeo} material={tireMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={rimOuterGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[wheelRotation + Math.PI / 2, 0, 0]} />
          <mesh geometry={centerCapGeo} material={rimMat} rotation={[wheelRotation, 0, 0]} />
        </group>

        {/* Trasera Derecha */}
        <group position={[1.02, 0.4, 1.35]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh geometry={tireGeo} material={tireMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={rimOuterGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[-wheelRotation, 0, 0]} />
          <mesh geometry={spokeGeo} material={spokeMat} rotation={[-wheelRotation + Math.PI / 2, 0, 0]} />
          <mesh geometry={centerCapGeo} material={rimMat} rotation={[-wheelRotation, 0, 0]} />
        </group>
      </group>
    </group>
  );
};
