import React, { useMemo } from 'react';
import * as THREE from 'three';
import { interpolate, spring } from 'remotion';

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
  // Materiales compartidos low-poly flat shading
  const skinMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: skinColor, flatShading: true }),
    [skinColor]
  );
  const shirtMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: shirtColor, flatShading: true }),
    [shirtColor]
  );
  const pantsMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: pantsColor, flatShading: true }),
    [pantsColor]
  );
  const jacketMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#00e5ff', flatShading: true }),
    []
  );
  const shoeMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#ffffff', flatShading: true }),
    []
  );
  const accessoryMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: rimColor }),
    [rimColor]
  );

  // Geometrías con pivotes en hombro, cadera y rodilla
  const headGeo = useMemo(() => new THREE.BoxGeometry(0.36, 0.4, 0.36), []);
  const torsoGeo = useMemo(() => new THREE.BoxGeometry(0.55, 0.75, 0.35), []);
  const jacketGeo = useMemo(() => new THREE.BoxGeometry(0.58, 0.77, 0.38), []);
  const armGeo = useMemo(() => new THREE.BoxGeometry(0.16, 0.65, 0.16), []);
  const upperLegGeo = useMemo(() => new THREE.BoxGeometry(0.2, 0.42, 0.2), []);
  const lowerLegGeo = useMemo(() => new THREE.BoxGeometry(0.19, 0.42, 0.19), []);
  const shoeGeo = useMemo(() => new THREE.BoxGeometry(0.22, 0.16, 0.32), []);

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
        // Brazos levantados en señal de pánico temblando
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
        // Salto con spring periódico
        const jumpProgress = (frame % 25) / 25;
        const jump = Math.sin(jumpProgress * Math.PI) * 0.4;
        bodyY = jump;
        // Brazos en V celebrando arriba
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
        // Manos a la cabeza
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
    <group
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* Contenedor con animación vertical y balanceo */}
      <group
        position={[0, 0.95 + anim.bodyY, 0]}
        rotation={[anim.bodyPitch, 0, anim.bodyRoll]}
      >
        {/* Torso */}
        <mesh geometry={torsoGeo} material={shirtMat} position={[0, 0.38, 0]} />

        {/* Chaqueta de accesorio */}
        {accessory === 'jacket' && (
          <mesh geometry={jacketGeo} material={jacketMat} position={[0, 0.38, 0]} />
        )}

        {/* Rim Light trasera cian/magenta */}
        <pointLight
          position={[0, 0.8, -1.2]}
          color={rimColor}
          intensity={1.8}
          distance={4}
          decay={2}
        />

        {/* Cabeza con pivote en cuello */}
        <group position={[0, 0.95, 0]} rotation={[anim.headPitch, 0, 0]}>
          <mesh geometry={headGeo} material={skinMat} />

          {/* Accesorios */}
          {accessory === 'glasses' && (
            <mesh position={[0, 0.05, 0.2]} material={accessoryMat}>
              <boxGeometry args={[0.34, 0.08, 0.06]} />
            </mesh>
          )}

          {accessory === 'cap' && (
            <group position={[0, 0.18, 0]}>
              <mesh material={pantsMat}>
                <boxGeometry args={[0.38, 0.1, 0.4]} />
              </mesh>
              <mesh position={[0, -0.02, 0.22]} material={pantsMat}>
                <boxGeometry args={[0.34, 0.03, 0.2]} />
              </mesh>
            </group>
          )}
        </group>

        {/* Brazo Izquierdo (pivote en hombro) */}
        <group
          position={[-0.38, 0.7, 0]}
          rotation={[anim.leftArmRotX, 0, anim.leftArmRotZ]}
        >
          <mesh geometry={armGeo} material={shirtMat} position={[0, -0.3, 0]} />
          {/* Mano */}
          <mesh
            geometry={headGeo}
            material={skinMat}
            scale={[0.35, 0.35, 0.35]}
            position={[0, -0.65, 0]}
          />
        </group>

        {/* Brazo Derecho (pivote en hombro) */}
        <group
          position={[0.38, 0.7, 0]}
          rotation={[anim.rightArmRotX, 0, anim.rightArmRotZ]}
        >
          <mesh geometry={armGeo} material={shirtMat} position={[0, -0.3, 0]} />
          {/* Mano */}
          <mesh
            geometry={headGeo}
            material={skinMat}
            scale={[0.35, 0.35, 0.35]}
            position={[0, -0.65, 0]}
          />
        </group>

        {/* Pierna Izquierda (pivotes en cadera y rodilla) */}
        <group
          position={[-0.16, 0.0, 0]}
          rotation={[anim.leftLegRotX, 0, 0]}
        >
          {/* Muslo */}
          <mesh geometry={upperLegGeo} material={pantsMat} position={[0, -0.21, 0]} />

          {/* Rodilla / pantorrilla */}
          <group position={[0, -0.42, 0]} rotation={[anim.leftKneeRotX, 0, 0]}>
            <mesh geometry={lowerLegGeo} material={pantsMat} position={[0, -0.21, 0]} />
            {/* Zapato */}
            <mesh
              geometry={shoeGeo}
              material={shoeMat}
              position={[0, -0.44, 0.06]}
            />
          </group>
        </group>

        {/* Pierna Derecha (pivotes en cadera y rodilla) */}
        <group
          position={[0.16, 0.0, 0]}
          rotation={[anim.rightLegRotX, 0, 0]}
        >
          {/* Muslo */}
          <mesh geometry={upperLegGeo} material={pantsMat} position={[0, -0.21, 0]} />

          {/* Rodilla / pantorrilla */}
          <group position={[0, -0.42, 0]} rotation={[anim.rightKneeRotX, 0, 0]}>
            <mesh geometry={lowerLegGeo} material={pantsMat} position={[0, -0.21, 0]} />
            {/* Zapato */}
            <mesh
              geometry={shoeGeo}
              material={shoeMat}
              position={[0, -0.44, 0.06]}
            />
          </group>
        </group>
      </group>
    </group>
  );
};
