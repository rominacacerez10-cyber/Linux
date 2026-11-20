import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { CameraRig, CameraShot } from '../world3d/CameraRig';
import { Lights } from '../world3d/Lights';
import { City } from '../world3d/City';
import { Palms } from '../world3d/Palms';
import { Fx } from '../layers/Fx';
import { WIDTH, HEIGHT } from '../data';

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Storyboard Escena 01 (120 frames):
  // Plano 1: f0-14 -> Puertas gigantes de neón cerradas, cámara frontal con shake fuerte.
  // Plano 2: f14-45 -> Puertas se abren con rotación spring; dolly-in veloz atravesándolas.
  // Plano 3: f45-90 -> Avenida al atardecer a ras de suelo a gran velocidad, palmeras y edificios.
  // Plano 4: f90-120 -> Whip-pan a la derecha con rotación yaw y roll.
  const shots: CameraShot[] = useMemo(
    () => [
      {
        from: 0,
        to: 14,
        posStart: [0, 2.5, 9],
        posEnd: [0, 2.5, 8.5],
        lookStart: [0, 2.5, 0],
        lookEnd: [0, 2.5, 0],
        fovStart: 50,
        fovEnd: 50,
        shake: 0.08,
      },
      {
        from: 14,
        to: 45,
        posStart: [0, 2.5, 8.5],
        posEnd: [0, 2.2, -6],
        lookStart: [0, 2.4, -10],
        lookEnd: [0, 2.0, -30],
        fovStart: 50,
        fovEnd: 62,
        shake: 0.02,
      },
      {
        from: 45,
        to: 90,
        posStart: [0, 0.8, -4],
        posEnd: [0, 0.9, -70],
        lookStart: [0, 1.2, -40],
        lookEnd: [0, 1.4, -130],
        fovStart: 64,
        fovEnd: 60,
        shake: 0.025,
      },
      {
        from: 90,
        to: 120,
        posStart: [0, 0.9, -70],
        posEnd: [2.5, 1.8, -85],
        lookStart: [0, 1.4, -130],
        lookEnd: [12, 4.0, -95],
        fovStart: 60,
        fovEnd: 68,
        rollStart: 0,
        rollEnd: 0.12,
        shake: 0.05,
      },
    ],
    []
  );

  // Apertura de las puertas de neón con spring a partir del frame 14
  const openProgress = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const gateAngle = interpolate(openProgress, [0, 1], [0, Math.PI * 0.48]);

  // Flash local de transición f0-14 y f90-95
  const flash = (() => {
    if (frame <= 12) return (12 - frame) / 12;
    if (frame >= 90 && frame <= 93) return (93 - frame) / 3;
    return 0;
  })();

  const isGlitch = (frame >= 90 && frame <= 95) || (frame >= 117 && frame <= 120);
  const speedLines = frame >= 45 && frame <= 90 ? 0.6 : 0;
  const whipBlur = frame >= 116 ? (frame - 116) * 3 : 0;

  // Velocidad de la avenida
  const citySpeed = frame >= 45 ? 1.6 : 0.4;
  const palmOffset = -frame * citySpeed;

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={35} fogFar={280} />
        <CameraRig frame={frame} shots={shots} />

        {/* Escenario de avenida y sol retro */}
        <City frame={frame} speed={citySpeed} />
        <Palms offsetZ={palmOffset} count={24} spacing={18} />

        {/* Puertas / rejas gigantes de neón en Z = 2 */}
        <group position={[0, 0, 2]}>
          {/* Marco superior / pórtico */}
          <mesh position={[0, 7.2, 0]}>
            <boxGeometry args={[14, 0.6, 0.6]} />
            <meshBasicMaterial color="#ff2e93" />
          </mesh>
          {/* Postes laterales del portal */}
          <mesh position={[-6.8, 3.6, 0]}>
            <boxGeometry args={[0.7, 7.2, 0.7]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <mesh position={[6.8, 3.6, 0]}>
            <boxGeometry args={[0.7, 7.2, 0.7]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>

          {/* Puerta Izquierda pivotando en X=-6.5 */}
          <group position={[-6.5, 0, 0]} rotation={[0, -gateAngle, 0]}>
            <group position={[3.25, 3.5, 0]}>
              <mesh>
                <boxGeometry args={[6.4, 6.8, 0.15]} />
                <meshLambertMaterial
                  color="#150628"
                  transparent
                  opacity={0.88}
                />
              </mesh>
              {/* Barras de neón verticales */}
              {[-2.4, -1.2, 0, 1.2, 2.4].map((bx) => (
                <mesh key={`lbar-${bx}`} position={[bx, 0, 0.1]}>
                  <boxGeometry args={[0.08, 6.6, 0.1]} />
                  <meshBasicMaterial color="#ff2e93" />
                </mesh>
              ))}
              {/* Borde exterior emissive */}
              <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[6.3, 0.12, 0.08]} />
                <meshBasicMaterial color="#00e5ff" />
              </mesh>
            </group>
          </group>

          {/* Puerta Derecha pivotando en X=6.5 */}
          <group position={[6.5, 0, 0]} rotation={[0, gateAngle, 0]}>
            <group position={[-3.25, 3.5, 0]}>
              <mesh>
                <boxGeometry args={[6.4, 6.8, 0.15]} />
                <meshLambertMaterial
                  color="#150628"
                  transparent
                  opacity={0.88}
                />
              </mesh>
              {/* Barras de neón verticales */}
              {[-2.4, -1.2, 0, 1.2, 2.4].map((bx) => (
                <mesh key={`rbar-${bx}`} position={[bx, 0, 0.1]}>
                  <boxGeometry args={[0.08, 6.6, 0.1]} />
                  <meshBasicMaterial color="#ff2e93" />
                </mesh>
              ))}
              {/* Borde exterior emissive */}
              <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[6.3, 0.12, 0.08]} />
                <meshBasicMaterial color="#00e5ff" />
              </mesh>
            </group>
          </group>

          {/* Luz cegadora que emana del portal al abrirse */}
          <pointLight
            position={[0, 3.5, -2]}
            color="#00e5ff"
            intensity={openProgress * 6}
            distance={40}
          />
        </group>
      </ThreeCanvas>

      {/* Capa FX local para la escena */}
      <Fx
        frame={frame}
        width={WIDTH}
        height={HEIGHT}
        grainOpacity={0.14}
        halftoneOpacity={0.08}
        vignetteOpacity={0.38}
        speedLinesOpacity={speedLines}
        lightLeakOpacity={0.2}
        flashOpacity={flash}
        glitchActive={isGlitch}
        chromaticShift={isGlitch ? 14 : 0}
        whipBlur={whipBlur}
      />
    </AbsoluteFill>
  );
};
