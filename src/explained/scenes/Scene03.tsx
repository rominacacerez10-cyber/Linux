import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { CameraRig, CameraShot } from '../world3d/CameraRig';
import { Lights } from '../world3d/Lights';
import { City } from '../world3d/City';
import { Palms } from '../world3d/Palms';
import { Car } from '../world3d/Car';
import { Patrol } from '../world3d/Patrol';
import { Humanoid } from '../world3d/Humanoid';
import { Particles } from '../world3d/Particles';
import { Fx } from '../layers/Fx';
import { WIDTH, HEIGHT } from '../data';

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Storyboard Escena 03 (190 frames):
  // Plano 1: f0-45 -> Cámara baja frontal, auto derrapando hacia la cámara con humo; whip-pan.
  // Plano 2: f45-95 -> Tracking lateral: patrulla persiguiendo con luces sirena; NPC corre en pánico (brazos arriba).
  // Plano 3: f95-145 -> Plano cenital/alto siguiendo al auto volando en rampa con giro; FOV kick.
  // Plano 4: f145-190 -> Jugador celebra frente a explosión de confeti neón; corte hacia DESMADRE.
  const shots: CameraShot[] = useMemo(
    () => [
      // Plano 1: Frontal baja, auto derrapando hacia cámara
      {
        from: 0,
        to: 45,
        posStart: [0, 1.2, 10],
        posEnd: [0.6, 1.4, -2],
        lookStart: [0, 1.0, -18],
        lookEnd: [-0.4, 1.0, -12],
        fovStart: 56,
        fovEnd: 62,
        shake: 0.04,
      },
      // Plano 2: Tracking lateral, persecución policial y transeúnte en pánico
      {
        from: 45,
        to: 95,
        posStart: [9, 2.5, -12],
        posEnd: [9, 2.5, -42],
        lookStart: [-2, 1.8, -16],
        lookEnd: [-2, 1.8, -46],
        fovStart: 50,
        fovEnd: 52,
        shake: 0.03,
      },
      // Plano 3: Cenital/picado alto con FOV kick siguiendo auto en rampa
      {
        from: 95,
        to: 145,
        posStart: [0, 18, -35],
        posEnd: [0, 22, -80],
        lookStart: [0, 4, -55],
        lookEnd: [0, 2, -100],
        fovStart: 72,
        fovEnd: 54, // FOV kick
        shake: 0.05,
      },
      // Plano 4: Frontal medio al jugador celebrando con confeti
      {
        from: 145,
        to: 190,
        posStart: [0, 2.2, -6],
        posEnd: [0, 2.4, -9],
        lookStart: [0, 1.8, -16],
        lookEnd: [0, 2.0, -20],
        fovStart: 48,
        fovEnd: 52,
        shake: 0.03,
      },
    ],
    []
  );

  // FÍSICA Y CINEMÁTICA POR PLANO:
  // Plano 1 (f0-45): Auto deportivo derrapa hacia la cámara
  const driftProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const carP1_Z = interpolate(frame, [0, 45], [-24, 2]);
  const carP1_X = interpolate(driftProgress, [0, 1], [-3.5, 0.4]);
  const carP1_RotY = interpolate(driftProgress, [0, 1], [0.35, -0.42]);

  // Plano 2 (f45-95): Patrulla persigue a auto deportivo; NPC huye
  const chaseZ = interpolate(frame, [45, 95], [-10, -55]);
  const npcRunZ = interpolate(frame, [45, 95], [-16, -42]);

  // Plano 3 (f95-145): Salto por rampa
  const jumpProgress = (frame - 95) / 50;
  const carJumpZ = interpolate(frame, [95, 145], [-50, -95]);
  const carJumpY = Math.max(0, Math.sin(Math.min(1, Math.max(0, jumpProgress)) * Math.PI) * 7.5);
  const carJumpRotX = interpolate(jumpProgress, [0, 0.4, 1], [0.35, -0.1, -0.45]);
  const carJumpRotZ = interpolate(jumpProgress, [0, 1], [0, 0.3]);

  // Plano 4 (f145-190): Celebración de la comunidad
  const isP4 = frame >= 145;

  // Efectos visuales de transición
  const whipBlur =
    (frame >= 42 && frame <= 45 ? (frame - 42) * 3 : 0) ||
    (frame >= 92 && frame <= 95 ? (frame - 92) * 3 : 0) ||
    (frame >= 142 && frame <= 145 ? (frame - 142) * 3 : 0) ||
    (frame >= 186 ? (frame - 186) * 3 : 0);

  const flash =
    (frame >= 95 && frame <= 98 ? (98 - frame) / 3 : 0) ||
    (frame >= 145 && frame <= 149 ? (149 - frame) / 4 : 0);

  const isGlitch = (frame >= 43 && frame <= 46) || (frame >= 143 && frame <= 146);

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={35} fogFar={280} />
        <CameraRig frame={frame} shots={shots} />
        <City frame={frame} speed={1.1} />
        <Palms offsetZ={-frame * 1.1} count={24} spacing={20} />

        {/* PLANO 1 (f0-45): Auto derrapando */}
        {frame < 45 && (
          <>
            <Car
              frame={frame}
              position={[carP1_X, 0, carP1_Z]}
              rotation={[0, carP1_RotY, 0]}
              color="#ff2e93"
              neonColor="#00e5ff"
              driftAngle={-0.3}
            />
            <Particles
              frame={frame}
              kind="smoke"
              count={20}
              origin={[carP1_X - 0.5, 0.3, carP1_Z + 1.8]}
              spread={[1.2, 0.8, 1.0]}
              seed="sc03-p1-smoke"
              lifeTime={18}
            />
            <Particles
              frame={frame}
              kind="sparks"
              count={12}
              origin={[carP1_X + 0.6, 0.2, carP1_Z + 1.2]}
              spread={[0.6, 0.5, 0.6]}
              seed="sc03-p1-sparks"
              lifeTime={14}
            />
          </>
        )}

        {/* PLANO 2 (f45-95): Persecución con patrulla y NPC en pánico */}
        {frame >= 45 && frame < 95 && (
          <>
            {/* Auto deportivo huyendo */}
            <Car
              frame={frame}
              position={[-1.8, 0, chaseZ - 8]}
              rotation={[0, 0.05, 0]}
              color="#ff2e93"
              neonColor="#00e5ff"
            />
            {/* Patrulla persiguiendo */}
            <Patrol
              frame={frame}
              position={[1.8, 0, chaseZ + 6]}
              rotation={[0, -0.04, 0]}
              speed={1.5}
            />
            {/* NPC corriendo en pánico en la acera derecha */}
            <Humanoid
              frame={frame}
              fps={fps}
              pose="panic"
              position={[6.5, 0.2, npcRunZ]}
              rotation={[0, -0.15, 0]}
              scale={1.25}
              shirtColor="#00e5ff"
              pantsColor="#ff7a3d"
              accessory="glasses"
            />
            <Particles
              frame={frame}
              kind="smoke"
              count={16}
              origin={[-1.8, 0.3, chaseZ - 6]}
              spread={[0.8, 0.6, 0.8]}
              seed="sc03-p2-smoke"
              lifeTime={14}
            />
          </>
        )}

        {/* PLANO 3 (f95-145): Rampa y salto volador del auto */}
        {frame >= 95 && frame < 145 && (
          <>
            {/* Rampa 3D retro neón */}
            <group position={[0, 0, -56]}>
              <mesh position={[0, 1.2, 0]} rotation={[0.22, 0, 0]}>
                <boxGeometry args={[4.2, 0.4, 7]} />
                <meshLambertMaterial color="#ff7a3d" />
              </mesh>
              {/* Luces de la rampa */}
              <mesh position={[-2.15, 1.2, 0]} rotation={[0.22, 0, 0]}>
                <boxGeometry args={[0.15, 0.5, 7]} />
                <meshBasicMaterial color="#00e5ff" />
              </mesh>
              <mesh position={[2.15, 1.2, 0]} rotation={[0.22, 0, 0]}>
                <boxGeometry args={[0.15, 0.5, 7]} />
                <meshBasicMaterial color="#00e5ff" />
              </mesh>
            </group>

            {/* Auto volando por los aires */}
            <Car
              frame={frame}
              position={[0, carJumpY, carJumpZ]}
              rotation={[carJumpRotX, 0, carJumpRotZ]}
              color="#ff2e93"
              neonColor="#00e5ff"
            />
            <Particles
              frame={frame}
              kind="sparks"
              count={18}
              origin={[0, 1.4, -54]}
              spread={[2.5, 1.2, 2.0]}
              seed="sc03-p3-ramp-sparks"
              lifeTime={22}
            />
          </>
        )}

        {/* PLANO 4 (f145-190): Celebración con explosión de confeti */}
        {isP4 && (
          <>
            {/* Jugador celebrando con gorra */}
            <Humanoid
              frame={frame}
              fps={fps}
              pose="celebrate"
              position={[0, 0.2, -18]}
              rotation={[0, 0, 0]}
              scale={1.35}
              shirtColor="#ff7a3d"
              pantsColor="#08031a"
              accessory="cap"
            />
            {/* Explosión masiva de confeti neón */}
            <Particles
              frame={frame}
              kind="confetti"
              count={45}
              origin={[0, 4.0, -18]}
              spread={[4.0, 3.5, 4.0]}
              seed="sc03-p4-confetti"
              lifeTime={38}
            />
          </>
        )}
      </ThreeCanvas>

      {/* Capa FX */}
      <Fx
        frame={frame}
        width={WIDTH}
        height={HEIGHT}
        grainOpacity={0.15}
        halftoneOpacity={0.1}
        vignetteOpacity={0.38}
        speedLinesOpacity={frame >= 95 && frame < 145 ? 0.65 : 0}
        lightLeakOpacity={0.22}
        flashOpacity={flash}
        glitchActive={isGlitch}
        chromaticShift={isGlitch ? 15 : 0}
        whipBlur={whipBlur}
      />
    </AbsoluteFill>
  );
};
