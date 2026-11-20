import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { HEIGHT, WIDTH } from '../data';
import { Lights } from '../world3d/Lights';
import { City } from '../world3d/City';
import { Car } from '../world3d/Car';
import { Humanoid } from '../world3d/Humanoid';
import { Particles } from '../world3d/Particles';
import { CameraRig, CameraShot } from '../world3d/CameraRig';

export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Time remapping: slow motion (0.15x) during impact f40-f120
  const localTime = useMemo(() => {
    if (frame < 40) return frame;
    if (frame < 120) return 40 + (frame - 40) * 0.15;
    return 40 + 80 * 0.15 + (frame - 120);
  }, [frame]);

  // Car motion
  const carZ = interpolate(localTime, [0, 40, 100], [18, 0, -2], {
    extrapolateRight: 'clamp',
  });

  // Humanoid roll
  const rolledDist = interpolate(localTime, [40, 100], [0, -6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera shots
  const shots: CameraShot[] = [
    {
      from: 0,
      to: 40,
      posStart: [-2, 1.4, 22],
      posEnd: [-1, 1.2, 5],
      lookStart: [0, 1.0, 0],
      lookEnd: [0, 0.8, -2],
      fovStart: 55,
      fovEnd: 55,
      shake: 0.01,
    },
    {
      from: 40,
      to: 120,
      posStart: [5, 2.2, 5],
      posEnd: [-5, 1.8, -5],
      lookStart: [0, 0.9, 0],
      lookEnd: [0, 0.9, 0],
      fovStart: 50,
      fovEnd: 42,
      shake: frame < 48 ? 0.08 : 0.02,
    },
    {
      from: 120,
      to: 180,
      posStart: [-1.2, 0.9, 2.5],
      posEnd: [-0.6, 0.6, 1.2],
      lookStart: [0, 0.5, 0],
      lookEnd: [0, 0.4, -0.5],
      fovStart: 45,
      fovEnd: 32,
      shake: 0.005,
    },
  ];

  // 2D Loupe / Magnifying Lens Overlay (f120-f180)
  const lensOpacity = interpolate(frame, [120, 130, 170, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lensScale = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={10} fogFar={110} />
        <CameraRig frame={frame} shots={shots} />

        <City frame={localTime} speed={0.1} />

        {/* Concrete Barrier */}
        <mesh position={[0, 0.6, -1]} castShadow receiveShadow>
          <boxGeometry args={[4, 1.2, 0.8]} />
          <meshStandardMaterial color="#3a3845" roughness={0.9} />
        </mesh>

        {/* Impacting Car */}
        <Car
          frame={localTime}
          position={[0, 0, carZ]}
          rotation={[0, 0, localTime >= 40 ? 0.25 : 0]}
          color="#ff2e93"
          looseParts={localTime >= 40}
        />

        {/* Pedestrian rolling back from collision */}
        <Humanoid
          frame={localTime}
          pose={localTime >= 40 ? 'roll' : 'panic'}
          position={[1.5, 0, rolledDist]}
          rotation={[0, localTime >= 40 ? localTime * 0.2 : 0, 0]}
          shirtColor="#00e5ff"
          pantsColor="#ff7a3d"
        />

        {/* Impact Particles: sparks & debris */}
        {frame >= 40 && (
          <>
            <Particles
              frame={frame - 40}
              count={60}
              kind="sparks"
              origin={[0, 0.8, 0]}
              spread={[2.5, 2, 2]}
              speed={0.8}
            />
            <Particles
              frame={frame - 40}
              count={45}
              kind="debris"
              origin={[0, 0.5, -0.5]}
              spread={[3, 2.5, 3]}
              speed={0.6}
            />
          </>
        )}
      </ThreeCanvas>

      {/* 2D Magnification Lens Effect Overlay */}
      {frame >= 120 && lensOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 480,
            height: 480,
            marginTop: -240,
            marginLeft: -240,
            borderRadius: '50%',
            border: '6px solid #00e5ff',
            boxShadow: '0 0 40px #ff2e93, inset 0 0 30px #00e5ff',
            pointerEvents: 'none',
            opacity: lensOpacity,
            transform: `scale(${lensScale})`,
            background:
              'radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(255,46,147,0.2) 70%, transparent 100%)',
            backdropFilter: 'contrast(1.3) saturate(1.4) brightness(1.1)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
