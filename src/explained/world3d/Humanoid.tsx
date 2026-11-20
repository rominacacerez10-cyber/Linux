import React, { useMemo } from 'react';
import * as THREE from 'three';
import { spring } from 'remotion';

export type HumanoidPose =
  | 'idle'
  | 'walk'
  | 'run'
  | 'panic'
  | 'celebrate'
  | 'shock'
  | 'roll';

export type AccessoryType = 'none' | 'cap' | 'glasses' | 'jacket';

export interface HumanoidProps {
  frame: number;
  fps?: number;
  pose?: HumanoidPose;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  skinColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  accessory?: AccessoryType;
  rimColor?: string;
}

export const Humanoid: React.FC<HumanoidProps> = ({
  frame,
  fps = 30,
  pose = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skinColor = '#fcd0a1',
  shirtColor = '#ff2e93',
  pantsColor = '#1a103c',
  accessory = 'none',
  rimColor = '#00e5ff',
}) => {
  // Materiales compartidos low-poly PBR
  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.62,
        metalness: 0.05,
        flatShading: true,
      }),
    [skinColor]
  );
  const hairMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1016',
        roughness: 0.8,
        metalness: 0.1,
        flatShading: true,
      }),
    []
  );
  const shirtMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: shirtColor,
        roughness: 0.48,
        metalness: 0.15,
        flatShading: true,
      }),
    [shirtColor]
  );
  const pantsMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: pantsColor,
        roughness: 0.58,
        metalness: 0.12,
        flatShading: true,
      }),
    [pantsColor]
  );
  const beltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#120a1c',
        roughness: 0.4,
        metalness: 0.6,
      }),
    []
  );
  const buckleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f6d365',
        roughness: 0.15,
        metalness: 0.95,
      }),
    []
  );
  const jacketMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00334d',
        emissiveIntensity: 0.6,
        roughness: 0.28,
        metalness: 0.72,
        flatShading: true,
      }),
    []
  );
  const shoeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.35,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );
  const shoeTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: shirtColor,
        roughness: 0.4,
        metalness: 0.3,
        flatShading: true,
      }),
    [shirtColor]
  );
  const glassesFrameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffd166',
        roughness: 0.1,
        metalness: 0.95,
      }),
    []
  );
  const glassesLensMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080512',
        roughness: 0.04,
        metalness: 0.98,
      }),
    []
  );

  // Geometrías anatómicas estilizadas (cabeza redondeada, torso en V, extremidades cilíndricas)
  const headGeo = useMemo(() => new THREE.SphereGeometry(0.175, 16, 12), []);
  const jawGeo = useMemo(() => new THREE.SphereGeometry(0.13, 12, 8), []);
  const noseGeo = useMemo(() => new THREE.BoxGeometry(0.045, 0.07, 0.055), []);
  const earGeo = useMemo(() => new THREE.SphereGeometry(0.05, 8, 8), []);
  const neckGeo = useMemo(() => new THREE.CylinderGeometry(0.085, 0.105, 0.17, 10), []);
  const hairCapGeo = useMemo(
    () => new THREE.SphereGeometry(0.184, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
    []
  );
  const hairBackGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.2, 0.1), []);
  const sideburnGeo = useMemo(() => new THREE.BoxGeometry(0.035, 0.11, 0.05), []);
  const chestGeo = useMemo(() => new THREE.CylinderGeometry(0.27, 0.2, 0.46, 10), []);
  const waistGeo = useMemo(() => new THREE.CylinderGeometry(0.19, 0.165, 0.2, 10), []);
  const beltGeo = useMemo(() => new THREE.BoxGeometry(0.42, 0.08, 0.29), []);
  const buckleGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.085, 0.035), []);
  const collarGeo = useMemo(() => new THREE.TorusGeometry(0.115, 0.025, 6, 14), []);
  const jacketGeo = useMemo(() => new THREE.CylinderGeometry(0.295, 0.235, 0.5, 10), []);
  const shoulderGeo = useMemo(() => new THREE.SphereGeometry(0.105, 10, 8), []);
  const bicepGeo = useMemo(() => new THREE.CapsuleGeometry(0.075, 0.17, 4, 8), []);
  const forearmGeo = useMemo(() => new THREE.CapsuleGeometry(0.058, 0.16, 4, 8), []);
  const handGeo = useMemo(() => new THREE.SphereGeometry(0.075, 8, 6), []);
  const upperLegGeo = useMemo(() => new THREE.CapsuleGeometry(0.095, 0.26, 4, 8), []);
  const lowerLegGeo = useMemo(() => new THREE.CapsuleGeometry(0.074, 0.25, 4, 8), []);
  const shoeGeo = useMemo(() => new THREE.BoxGeometry(0.2, 0.13, 0.34), []);
  const shoeSoleGeo = useMemo(() => new THREE.BoxGeometry(0.21, 0.045, 0.36), []);
  const chainGeo = useMemo(() => new THREE.TorusGeometry(0.1, 0.012, 6, 16), []);

  // Animaciones y ángulos articulares basados en la pose y frame
  const anim = useMemo(() => {
    let bodyY = 0;
    let bodyPitch = 0;
    let bodyRoll = 0;
    let headPitch = 0;
    let leftArmRotX = 0;
    let rightArmRotX = 0;
    let leftArmRotZ = 0;
    let rightArmRotZ = 0;
    let leftLegRotX = 0;
    let rightLegRotX = 0;
    let leftKneeRotX = 0;
    let rightKneeRotX = 0;

    const t = frame * 0.2;

    switch (pose) {
      case 'idle': {
        const breath = Math.sin(frame * 0.1) * 0.03;
        bodyY = breath;
        headPitch = Math.sin(frame * 0.08) * 0.08;
        leftArmRotZ = 0.15;
        rightArmRotZ = -0.15;
        leftArmRotX = Math.sin(frame * 0.05) * 0.05;
        rightArmRotX = -Math.sin(frame * 0.05) * 0.05;
        break;
      }
      case 'walk': {
        const cycle = Math.sin(t);
        bodyY = Math.abs(Math.sin(t * 2)) * 0.06;
        leftLegRotX = cycle * 0.5;
        rightLegRotX = -cycle * 0.5;
        leftKneeRotX = cycle > 0 ? cycle * 0.4 : 0.05;
        rightKneeRotX = cycle < 0 ? -cycle * 0.4 : 0.05;
        leftArmRotX = -cycle * 0.5;
        rightArmRotX = cycle * 0.5;
        leftArmRotZ = 0.1;
        rightArmRotZ = -0.1;
        break;
      }
      case 'run': {
        const cycle = Math.sin(t * 1.8);
        bodyPitch = 0.25;
        bodyY = Math.abs(Math.sin(t * 3.6)) * 0.14;
        leftLegRotX = cycle * 0.95;
        rightLegRotX = -cycle * 0.95;
        leftKneeRotX = cycle > 0 ? cycle * 0.7 : 0.1;
        rightKneeRotX = cycle < 0 ? -cycle * 0.7 : 0.1;
        leftArmRotX = -cycle * 0.95;
        rightArmRotX = cycle * 0.95;
        leftArmRotZ = 0.2;
        rightArmRotZ = -0.2;
        break;
      }
      case 'panic': {
        const jitter = Math.sin(frame * 1.2) * 0.05;
        bodyY = Math.abs(Math.sin(frame * 0.5)) * 0.08;
        bodyPitch = -0.1 + jitter;
        headPitch = -0.3 + jitter;
        leftArmRotX = Math.PI * 0.85 + Math.sin(frame * 0.8) * 0.2;
        rightArmRotX = Math.PI * 0.85 + Math.cos(frame * 0.8) * 0.2;
        leftArmRotZ = 0.4 + jitter;
        rightArmRotZ = -0.4 - jitter;
        leftLegRotX = Math.sin(frame * 0.8) * 0.4;
        rightLegRotX = -Math.sin(frame * 0.8) * 0.4;
        leftKneeRotX = 0.2;
        rightKneeRotX = 0.2;
        break;
      }
      case 'celebrate': {
        const jumpProgress = (frame % 25) / 25;
        const jump = Math.sin(jumpProgress * Math.PI) * 0.4;
        bodyY = jump;
        leftArmRotX = Math.PI * 0.85;
        rightArmRotX = Math.PI * 0.85;
        leftArmRotZ = 0.55 + Math.sin(frame * 0.3) * 0.15;
        rightArmRotZ = -0.55 - Math.sin(frame * 0.3) * 0.15;
        headPitch = -0.35;
        leftLegRotX = jump > 0.1 ? 0.3 : 0;
        rightLegRotX = jump > 0.1 ? -0.2 : 0;
        leftKneeRotX = jump > 0.1 ? 0.4 : 0.05;
        rightKneeRotX = jump > 0.1 ? 0.3 : 0.05;
        break;
      }
      case 'shock': {
        bodyPitch = -0.15;
        headPitch = 0.1;
        leftArmRotX = Math.PI * 0.7;
        rightArmRotX = Math.PI * 0.7;
        leftArmRotZ = 0.8;
        rightArmRotZ = -0.8;
        leftKneeRotX = 0.1;
        rightKneeRotX = 0.1;
        break;
      }
      case 'roll': {
        const rollSp = spring({
          frame: frame % 40,
          fps,
          config: { damping: 14, stiffness: 80 },
        });
        bodyRoll = rollSp * Math.PI * 2;
        bodyY = 0.2 + Math.sin(rollSp * Math.PI) * 0.3;
        leftArmRotX = 1.2;
        rightArmRotX = 1.2;
        leftLegRotX = 1.0;
        rightLegRotX = 1.0;
        leftKneeRotX = 0.8;
        rightKneeRotX = 0.8;
        break;
      }
    }

    return {
      bodyY,
      bodyPitch,
      bodyRoll,
      headPitch,
      leftArmRotX,
      rightArmRotX,
      leftArmRotZ,
      rightArmRotZ,
      leftLegRotX,
      rightLegRotX,
      leftKneeRotX,
      rightKneeRotX,
    };
  }, [frame, fps, pose]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Contenedor con animación vertical y balanceo */}
      <group
        position={[0, 0.95 + anim.bodyY, 0]}
        rotation={[anim.bodyPitch, 0, anim.bodyRoll]}
      >
        {/* Torso atlético en V, cintura afinada y cinturón con hebilla dorada */}
        <group position={[0, 0.42, 0]}>
          <mesh geometry={chestGeo} material={shirtMat} position={[0, 0.24, 0]} scale={[1, 1, 0.78]} />
          <mesh geometry={waistGeo} material={shirtMat} position={[0, -0.02, 0]} scale={[1, 1, 0.76]} />
          <mesh geometry={beltGeo} material={beltMat} position={[0, -0.15, 0]} />
          <mesh geometry={buckleGeo} material={buckleMat} position={[0, -0.15, 0.135]} />
          <mesh geometry={collarGeo} material={shirtMat} position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={chainGeo} material={buckleMat} position={[0, 0.43, 0.075]} rotation={[Math.PI / 2, 0, 0]} />
          {/* Hombros redondeados */}
          <mesh geometry={shoulderGeo} material={shirtMat} position={[-0.26, 0.4, 0]} scale={[1.1, 0.9, 1]} />
          <mesh geometry={shoulderGeo} material={shirtMat} position={[0.26, 0.4, 0]} scale={[1.1, 0.9, 1]} />
        </group>

        {/* Chaqueta de accesorio */}
        {accessory === 'jacket' && (
          <mesh geometry={jacketGeo} material={jacketMat} position={[0, 0.56, 0]} scale={[1, 1, 0.82]} />
        )}

        {/* Rim Light trasera cian/magenta */}
        <pointLight
          position={[0, 0.8, -1.2]}
          color={rimColor}
          intensity={1.8}
          distance={4}
          decay={2}
        />

        {/* Cuello y cabeza estilizada con peinado Vice City y lentes oscuros */}
        <group position={[0, 0.84, 0]} rotation={[anim.headPitch, 0, 0]}>
          <mesh geometry={neckGeo} material={skinMat} position={[0, 0.1, 0]} />

          <group position={[0, 0.32, 0]}>
            {/* Cráneo redondeado */}
            <mesh geometry={headGeo} material={skinMat} scale={[1, 1.06, 0.94]} />
            {/* Mandíbula / mentón */}
            <mesh geometry={jawGeo} material={skinMat} position={[0, -0.115, 0.015]} scale={[1, 0.72, 0.92]} />
            {/* Nariz */}
            <mesh geometry={noseGeo} material={skinMat} position={[0, -0.01, 0.17]} />
            {/* Orejas */}
            <mesh geometry={earGeo} material={skinMat} position={[-0.172, 0.0, 0]} scale={[0.6, 1, 0.7]} />
            <mesh geometry={earGeo} material={skinMat} position={[0.172, 0.0, 0]} scale={[0.6, 1, 0.7]} />

            {/* Cabello con calota superior, nuca y patillas */}
            <mesh geometry={hairCapGeo} material={hairMat} position={[0, 0.015, -0.005]} />
            <mesh geometry={hairBackGeo} material={hairMat} position={[0, 0.035, -0.145]} />
            <mesh geometry={sideburnGeo} material={hairMat} position={[-0.155, -0.02, 0.035]} />
            <mesh geometry={sideburnGeo} material={hairMat} position={[0.155, -0.02, 0.035]} />

            {/* Lentes de sol oscuros Vice City con montura dorada */}
            <group position={[0, 0.035, 0.158]}>
              <mesh material={glassesFrameMat}>
                <boxGeometry args={[0.33, 0.025, 0.035]} />
              </mesh>
              <mesh position={[-0.083, -0.032, 0.005]} material={glassesLensMat}>
                <boxGeometry args={[0.125, 0.078, 0.03]} />
              </mesh>
              <mesh position={[0.083, -0.032, 0.005]} material={glassesLensMat}>
                <boxGeometry args={[0.125, 0.078, 0.03]} />
              </mesh>
              <mesh position={[-0.155, -0.01, -0.04]} rotation={[0, 0.3, 0]} material={glassesFrameMat}>
                <boxGeometry args={[0.11, 0.015, 0.02]} />
              </mesh>
              <mesh position={[0.155, -0.01, -0.04]} rotation={[0, -0.3, 0]} material={glassesFrameMat}>
                <boxGeometry args={[0.11, 0.015, 0.02]} />
              </mesh>
            </group>

            {/* Accesorio Gorra alternativa */}
            {accessory === 'cap' && (
              <group position={[0, 0.19, 0]}>
                <mesh material={pantsMat}>
                  <cylinderGeometry args={[0.185, 0.19, 0.11, 12]} />
                </mesh>
                <mesh position={[0, -0.05, 0.2]} material={pantsMat}>
                  <boxGeometry args={[0.3, 0.03, 0.2]} />
                </mesh>
              </group>
            )}
          </group>
        </group>

        {/* Brazo Izquierdo articulado (hombro, bíceps, antebrazo y mano) */}
        <group
          position={[-0.33, 0.72, 0]}
          rotation={[anim.leftArmRotX, 0, anim.leftArmRotZ]}
        >
          <mesh geometry={shoulderGeo} material={shirtMat} scale={[1.05, 1, 1.05]} />
          <mesh geometry={bicepGeo} material={shirtMat} position={[0, -0.17, 0]} />
          <group position={[0, -0.34, 0]} rotation={[0.15, 0, 0]}>
            <mesh geometry={forearmGeo} material={skinMat} position={[0, -0.16, 0]} />
            <mesh geometry={handGeo} material={skinMat} position={[0, -0.35, 0.02]} scale={[0.95, 1.15, 0.8]} />
          </group>
        </group>

        {/* Brazo Derecho articulado (hombro, bíceps, antebrazo y mano) */}
        <group
          position={[0.33, 0.72, 0]}
          rotation={[anim.rightArmRotX, 0, anim.rightArmRotZ]}
        >
          <mesh geometry={shoulderGeo} material={shirtMat} scale={[1.05, 1, 1.05]} />
          <mesh geometry={bicepGeo} material={shirtMat} position={[0, -0.17, 0]} />
          <group position={[0, -0.34, 0]} rotation={[0.15, 0, 0]}>
            <mesh geometry={forearmGeo} material={skinMat} position={[0, -0.16, 0]} />
            <mesh geometry={handGeo} material={skinMat} position={[0, -0.35, 0.02]} scale={[0.95, 1.15, 0.8]} />
          </group>
        </group>

        {/* Pierna Izquierda articulada (cadera, muslo, pantorrilla y zapatilla) */}
        <group position={[-0.15, 0.12, 0]} rotation={[anim.leftLegRotX, 0, 0]}>
          <mesh geometry={upperLegGeo} material={pantsMat} position={[0, -0.22, 0]} />
          <group position={[0, -0.46, 0]} rotation={[anim.leftKneeRotX, 0, 0]}>
            <mesh geometry={lowerLegGeo} material={pantsMat} position={[0, -0.2, 0]} />
            <group position={[0, -0.46, 0.06]}>
              <mesh geometry={shoeGeo} material={shoeTrimMat} />
              <mesh geometry={shoeSoleGeo} material={shoeMat} position={[0, -0.06, 0.01]} />
            </group>
          </group>
        </group>

        {/* Pierna Derecha articulada (cadera, muslo, pantorrilla y zapatilla) */}
        <group position={[0.15, 0.12, 0]} rotation={[anim.rightLegRotX, 0, 0]}>
          <mesh geometry={upperLegGeo} material={pantsMat} position={[0, -0.22, 0]} />
          <group position={[0, -0.46, 0]} rotation={[anim.rightKneeRotX, 0, 0]}>
            <mesh geometry={lowerLegGeo} material={pantsMat} position={[0, -0.2, 0]} />
            <group position={[0, -0.46, 0.06]}>
              <mesh geometry={shoeGeo} material={shoeTrimMat} />
              <mesh geometry={shoeSoleGeo} material={shoeMat} position={[0, -0.06, 0.01]} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
