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

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Niebla profunda y oscura para mantener alto contraste sin quemar en blanco */}
        <Lights fogColor="#150325" fogNear={45} fogFar={340} />
        <CameraRig frame={frame} shots={shots} />

        {/* Rooftop Building structure */}
        <mesh position={[0, 5, 5]}>
          <boxGeometry args={[14, 10, 14]} />
          <meshStandardMaterial
            color="#1a0a2a"
            emissive="#0d0418"
            emissiveIntensity={0.5}
            roughness={0.7}
            metalness={0.4}
          />
        </mesh>

        {/* Filos de neón en la azotea para el cierre Vice City */}
        <mesh position={[-7.03, 10.04, 5]}>
          <boxGeometry args={[0.12, 0.12, 14]} />
          <meshStandardMaterial color="#ff2e93" emissive="#ff2e93" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
        <mesh position={[7.03, 10.04, 5]}>
          <boxGeometry args={[0.12, 0.12, 14]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
        <mesh position={[0, 10.04, -2.03]}>
          <boxGeometry args={[14, 0.12, 0.12]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.8} toneMapped={false} />
        </mesh>
        <mesh position={[0, 10.04, 12.03]}>
          <boxGeometry args={[14, 0.12, 0.12]} />
          <meshStandardMaterial color="#ff2e93" emissive="#ff2e93" emissiveIntensity={2.8} toneMapped={false} />
        </mesh>

        {/* Halo cálido del horizonte detrás del skyline */}
        <mesh position={[0, 22, -300]}>
          <planeGeometry args={[420, 120]} />
          <meshBasicMaterial color="#3a0a4a" transparent opacity={0.55} toneMapped={false} />
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

        {/* City Skyline con ventanas y neones nítidos */}
        <City frame={frame} speed={0.05} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
