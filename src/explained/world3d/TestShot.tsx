import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Lights } from './Lights';
import { City } from './City';
import { Palms } from './Palms';
import { CameraRig, CameraShot } from './CameraRig';
import { Humanoid } from './Humanoid';
import { Car } from './Car';
import { Patrol } from './Patrol';
import { Particles } from './Particles';

export const TestShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Cámara cinematográfica a nivel de calle con perspectiva vertical que capta
  // el auto derrapando, la patrulla persiguiendo, los humanoides y las partículas
  const shots: CameraShot[] = [
    {
      from: 0,
      to: 300,
      posStart: [3.5, 3.0, 10],
      posEnd: [-1.5, 3.5, -45],
      lookStart: [0, 1.6, -14],
      lookEnd: [0, 1.8, -65],
      fovStart: 54,
      fovEnd: 58,
      rollStart: -0.04,
      rollEnd: 0.03,
      shake: 0.02,
    },
  ];

  const citySpeed = 0.8;
  const palmOffsetZ = -frame * citySpeed;

  // Movimiento dinámico del auto deportivo y patrulla alrededor del frame 90
  const carZ = -8 - (frame * 0.4);
  const patrolZ = 12 - (frame * 0.35);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#07030f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights />
        <CameraRig frame={frame} shots={shots} />
        <City frame={frame} speed={citySpeed} />
        <Palms offsetZ={palmOffsetZ} count={20} spacing={20} />

        {/* Auto deportivo low-poly derrapando */}
        <Car
          frame={frame}
          position={[-2.4, 0, carZ]}
          rotation={[0, 0.12, 0]}
          color="#ff2e93"
          neonColor="#00e5ff"
          driftAngle={-0.28}
        />

        {/* Humo y chispas de derrape detrás de las ruedas del auto */}
        <Particles
          frame={frame}
          kind="smoke"
          count={18}
          origin={[-2.4, 0.4, carZ + 2.2]}
          spread={[1.2, 1.0, 1.0]}
          seed="car-smoke"
          lifeTime={22}
        />
        <Particles
          frame={frame}
          kind="sparks"
          count={12}
          origin={[-3.2, 0.2, carZ + 1.2]}
          spread={[0.8, 0.6, 0.8]}
          seed="car-sparks"
          lifeTime={16}
        />

        {/* Patrulla persiguiendo con sirena alternando rojo y azul */}
        <Patrol
          frame={frame}
          position={[2.0, 0, patrolZ]}
          rotation={[0, -0.06, 0]}
          speed={1.2}
        />

        {/* 3 Humanoides con distintas poses en la acera y calle */}
        {/* Humanoide 1: Celebrando en la acera izquierda con gorra */}
        <Humanoid
          frame={frame}
          fps={fps}
          pose="celebrate"
          position={[-6.5, 0.2, -6]}
          rotation={[0, 0.6, 0]}
          scale={1.2}
          shirtColor="#ff7a3d"
          pantsColor="#08031a"
          accessory="cap"
        />

        {/* Humanoide 2: En pánico corriendo en la acera derecha con gafas neón */}
        <Humanoid
          frame={frame}
          fps={fps}
          pose="panic"
          position={[6.2, 0.2, -14]}
          rotation={[0, -0.4, 0]}
          scale={1.15}
          shirtColor="#00e5ff"
          pantsColor="#2a0845"
          accessory="glasses"
        />

        {/* Humanoide 3: En shock cerca de la esquina con chaqueta neón */}
        <Humanoid
          frame={frame}
          fps={fps}
          pose="shock"
          position={[-5.8, 0.2, -22]}
          rotation={[0, 0.8, 0]}
          scale={1.1}
          shirtColor="#ff2e93"
          pantsColor="#130924"
          accessory="jacket"
        />

        {/* Lluvia de confeti neón en la celebración */}
        <Particles
          frame={frame}
          kind="confetti"
          count={25}
          origin={[-6.5, 3.5, -6]}
          spread={[2.5, 2.0, 2.5]}
          seed="confetti-shot"
          lifeTime={35}
        />
      </ThreeCanvas>
    </div>
  );
};
