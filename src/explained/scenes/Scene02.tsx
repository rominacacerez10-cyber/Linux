import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { CameraRig, CameraShot } from '../world3d/CameraRig';
import { Lights } from '../world3d/Lights';
import { City } from '../world3d/City';
import { Fx } from '../layers/Fx';
import { WIDTH, HEIGHT, SAFE } from '../data';

// Ícono 3D extruido de red social (Play, Corazón, Llama, Pulgar) hecho con primitivas
interface FloatingIconProps {
  frame: number;
  seed: string;
  index: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ frame, seed, index }) => {
  const iconKind = index % 4; // 0=heart, 1=play, 2=flame, 3=thumb/like

  // Trayectoria disparada desde el centro de la ciudad hacia la cámara
  const startZ = -120 + random(`${seed}-sz`) * 40;
  const targetZ = 30;
  const speedZ = 0.9 + random(`${seed}-spd`) * 1.2;
  const currentZ = startZ + ((frame * speedZ * 1.5) % (targetZ - startZ));

  const posX = (random(`${seed}-x`) * 2 - 1) * 18;
  const posY = 4 + random(`${seed}-y`) * 18;

  const rotSpeedX = (random(`${seed}-rx`) * 2 - 1) * 0.04;
  const rotSpeedY = (random(`${seed}-ry`) * 2 - 1) * 0.06;
  const rotSpeedZ = (random(`${seed}-rz`) * 2 - 1) * 0.03;

  const color =
    iconKind === 0
      ? '#ff2e93'
      : iconKind === 1
      ? '#00e5ff'
      : iconKind === 2
      ? '#ff7a3d'
      : '#ffffff';

  return (
    <group
      position={[posX, posY, currentZ]}
      rotation={[frame * rotSpeedX, frame * rotSpeedY, frame * rotSpeedZ]}
    >
      {/* 0: Corazón (2 esferas + cono invertido) */}
      {iconKind === 0 && (
        <group scale={1.2}>
          <mesh position={[-0.32, 0.25, 0]}>
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0.32, 0.25, 0]}>
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.65, 0.9, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      )}

      {/* 1: Botón Play (prisma triangular extruido) */}
      {iconKind === 1 && (
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.75, 1.2, 3]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}

      {/* 2: Llama de fuego (cilindro y conos concéntricos) */}
      {iconKind === 2 && (
        <group scale={1.3}>
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.55, 1.2, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.35, 0.8, 10]} />
            <meshBasicMaterial color="#ff2e93" />
          </mesh>
        </group>
      )}

      {/* 3: Like / Pulgar (caja base + cilindro) */}
      {iconKind === 3 && (
        <group scale={1.1}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.75, 0.65, 0.35]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.18, 0.18, 0.6, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();

  // Storyboard Escena 02 (180 frames):
  // Plano 1: f0-60 -> Plano aéreo en órbita rápida sobre la ciudad; íconos 3D disparados hacia cámara.
  // Plano 2: f60-120 -> Push-in agresivo atravesando lluvia de íconos, líneas de velocidad, contador 999+.
  // Plano 3: f120-180 -> Whip-pan y pull-back; ciudad cubierta de íconos flotantes y rayos de luz.
  const shots: CameraShot[] = useMemo(
    () => [
      {
        from: 0,
        to: 60,
        posStart: [14, 28, 22],
        posEnd: [-12, 22, -18],
        lookStart: [0, 6, -30],
        lookEnd: [0, 4, -50],
        fovStart: 55,
        fovEnd: 58,
        rollStart: -0.06,
        rollEnd: 0.06,
        shake: 0.03,
      },
      {
        from: 60,
        to: 120,
        posStart: [0, 10, 8],
        posEnd: [0, 5, -55],
        lookStart: [0, 8, -40],
        lookEnd: [0, 4, -110],
        fovStart: 58,
        fovEnd: 68,
        shake: 0.04,
      },
      {
        from: 120,
        to: 180,
        posStart: [0, 5, -55],
        posEnd: [16, 26, 12],
        lookStart: [0, 4, -110],
        lookEnd: [0, 8, -45],
        fovStart: 68,
        fovEnd: 52,
        rollStart: 0.1,
        rollEnd: -0.04,
        shake: 0.035,
      },
    ],
    []
  );

  // Cantidad determinista de íconos 3D
  const iconCount = 38;
  const icons = useMemo(
    () =>
      Array.from({ length: iconCount }, (_, i) => ({
        id: `icon-${i}`,
        seed: `sc02-icon-${i}`,
        index: i,
      })),
    [iconCount]
  );

  // Contador gigante decorativo f60-120 ("999+")
  const counterVisible = frame >= 60 && frame < 120;
  const counterVal = Math.min(
    999,
    Math.floor(interpolate(frame, [60, 115], [12, 999], { extrapolateRight: 'clamp' }))
  );
  const counterSuffix = counterVal >= 999 ? '+' : '';

  // Efectos de transición
  const isGlitch = frame >= 118 && frame <= 122;
  const speedLines = frame >= 60 && frame <= 120 ? 0.75 : 0;
  const flash = frame >= 120 && frame <= 124 ? (124 - frame) / 4 : 0;
  const whipBlur = frame >= 176 ? (frame - 176) * 3 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={30} fogFar={260} />
        <CameraRig frame={frame} shots={shots} />
        <City frame={frame} speed={1.2} />

        {/* Lluvia de íconos de redes 3D flotando por la ciudad */}
        {icons.map((item) => (
          <FloatingIcon
            key={item.id}
            frame={frame}
            seed={item.seed}
            index={item.index}
          />
        ))}

        {/* Rayos de luz verticales neón en f120-180 */}
        {frame >= 115 &&
          [-8, -3, 3, 8].map((lx, idx) => (
            <mesh
              key={`light-beam-${idx}`}
              position={[lx, 15, -40 - idx * 10]}
              rotation={[0, 0, 0]}
            >
              <cylinderGeometry args={[0.3, 0.8, 40, 8]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#00e5ff' : '#ff2e93'}
                transparent
                opacity={0.35}
              />
            </mesh>
          ))}
      </ThreeCanvas>

      {/* Contador gigante decorativo 999+ (en zona segura) */}
      {counterVisible && (
        <div
          style={{
            position: 'absolute',
            top: SAFE.top + 60,
            left: 0,
            width: '100%',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize: 160,
              lineHeight: 1,
              color: '#00e5ff',
              textShadow:
                '0 0 20px #00e5ff, 0 0 50px #ff2e93, 4px 4px 0 #07030f',
              letterSpacing: 4,
            }}
          >
            {counterVal}
            {counterSuffix}
          </div>
          <div
            style={{
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize: 28,
              color: '#ff2e93',
              letterSpacing: 8,
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            CLIPS EN SEGUNDOS
          </div>
        </div>
      )}

      {/* Capa FX */}
      <Fx
        frame={frame}
        width={WIDTH}
        height={HEIGHT}
        grainOpacity={0.15}
        halftoneOpacity={0.12}
        vignetteOpacity={0.4}
        speedLinesOpacity={speedLines}
        lightLeakOpacity={0.25}
        flashOpacity={flash}
        glitchActive={isGlitch}
        chromaticShift={speedLines > 0 ? 8 : isGlitch ? 15 : 0}
        whipBlur={whipBlur}
      />
    </AbsoluteFill>
  );
};
