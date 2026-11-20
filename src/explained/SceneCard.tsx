import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Scene, WIDTH, HEIGHT } from './data';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Lights } from './world3d/Lights';
import { City } from './world3d/City';
import { Palms } from './world3d/Palms';
import { CameraRig } from './world3d/CameraRig';
import { Fx } from './layers/Fx';

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

// Fondo 3D de avenida continuo sin texto para escenas 04-06 (etapa previa a la Etapa 07)
const DefaultAvenueBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const shots = [
    {
      from: 0,
      to: 300,
      posStart: [0, 2.5, 10] as [number, number, number],
      posEnd: [0, 2.5, -50] as [number, number, number],
      lookStart: [0, 1.8, -20] as [number, number, number],
      lookEnd: [0, 1.8, -80] as [number, number, number],
      fovStart: 54,
      fovEnd: 54,
      shake: 0.015,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" />
        <CameraRig frame={frame} shots={shots} />
        <City frame={frame} speed={0.9} />
        <Palms offsetZ={-frame * 0.9} count={20} spacing={20} />
      </ThreeCanvas>
      <Fx
        frame={frame}
        width={WIDTH}
        height={HEIGHT}
        grainOpacity={0.14}
        halftoneOpacity={0.08}
        vignetteOpacity={0.35}
      />
    </AbsoluteFill>
  );
};

export const SceneCard: React.FC<SceneCardProps> = ({ sceneIndex }) => {
  if (sceneIndex === 0) {
    return <Scene01 />;
  }
  if (sceneIndex === 1) {
    return <Scene02 />;
  }
  if (sceneIndex === 2) {
    return <Scene03 />;
  }

  // 04-06 continúan con fondo de avenida 3D sin texto (hasta la Etapa 07)
  return <DefaultAvenueBackground />;
};
