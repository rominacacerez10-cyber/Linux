import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Lights } from './Lights';
import { City } from './City';
import { Palms } from './Palms';
import { CameraRig, CameraShot } from './CameraRig';

export const TestShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Test dolly shot: cámara baja a ras de suelo a gran velocidad con tilt leve
  const shots: CameraShot[] = [
    {
      from: 0,
      to: 300,
      posStart: [0, 1.8, 60],
      posEnd: [0, 2.4, -180],
      lookStart: [0, 3.2, 0],
      lookEnd: [0, 4.0, -260],
      fovStart: 50,
      fovEnd: 55,
      rollStart: -0.04,
      rollEnd: 0.04,
      shake: 0.03,
    },
  ];

  const citySpeed = 1.2;
  const palmOffsetZ = -frame * citySpeed;

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
      </ThreeCanvas>
    </div>
  );
};
