import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { HEIGHT, WIDTH } from '../data';
import { Lights } from '../world3d/Lights';
import { City } from '../world3d/City';
import { Palms } from '../world3d/Palms';
import { Humanoid } from '../world3d/Humanoid';
import { CameraRig, CameraShot } from '../world3d/CameraRig';

export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();

  const shots: CameraShot[] = [
    {
      // Rooftop view, player standing looking at skyline
      from: 0,
      to: 60,
      posStart: [0, 11.2, 12],
      posEnd: [0, 12.8, 10],
      lookStart: [0, 11, -20],
      lookEnd: [0, 10, -40],
      fovStart: 55,
      fovEnd: 55,
      shake: 0.008,
    },
    {
      // Crane-up & slow dolly-out while city glows
      from: 60,
      to: 160,
      posStart: [0, 12.8, 10],
      posEnd: [0, 18, 30],
      lookStart: [0, 10, -40],
      lookEnd: [0, 8, -60],
      fovStart: 55,
      fovEnd: 65,
      shake: 0.005,
    },
  ];

  // Blinding white/magenta flash near frame 160 to match frame 0
  const endFlashOpacity = interpolate(frame, [120, 158, 160], [0, 0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={15} fogFar={120} />
        <CameraRig frame={frame} shots={shots} />

        {/* Rooftop Building structure */}
        <mesh position={[0, 5, 5]}>
          <boxGeometry args={[14, 10, 14]} />
          <meshStandardMaterial color="#1a0a2a" roughness={0.8} />
        </mesh>

        {/* Player standing on roof edge facing distant skyline */}
        <Humanoid
          frame={frame}
          pose="idle"
          position={[0, 10, 0]}
          rotation={[0, Math.PI, 0]}
          shirtColor="#ff2e93"
          pantsColor="#00e5ff"
        />

        {/* Swaying Palms on rooftop garden */}
        <Palms offsetZ={-frame * 0.2} count={6} spacing={8} />

        {/* City Skyline */}
        <City frame={frame} speed={0.05} />
      </ThreeCanvas>

      {/* Blinding transition overlay at the end to match frame 0 (looping) */}
      {endFlashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#ffffff',
            opacity: endFlashOpacity,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
