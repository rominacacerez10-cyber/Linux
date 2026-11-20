import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { HEIGHT, WIDTH } from '../data';
import { Lights } from '../world3d/Lights';
import { Humanoid } from '../world3d/Humanoid';
import { CameraRig, CameraShot } from '../world3d/CameraRig';

export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // f0-f8: blackout handle
  if (frame < 8) {
    return <AbsoluteFill style={{ backgroundColor: '#000000' }} />;
  }

  // Neon sign lighting logic (f70-f190 sequential turn-on)
  const tubeLight1 = frame >= 75;
  const tubeLight2 = frame >= 88;
  const tubeLight3 = frame >= 100;

  // Crowd humanoids grid layout
  const crowd = useMemo(() => {
    const list = [];
    for (let x = -4; x <= 4; x += 1.6) {
      for (let z = -2; z <= 4; z += 1.8) {
        list.push({
          x: x + (Math.sin(x * 3) * 0.3),
          z: z + (Math.cos(z * 2) * 0.3),
          skin: x % 2 === 0 ? '#ffb380' : '#8d5524',
          shirt: x % 3 === 0 ? '#00e5ff' : x % 2 === 0 ? '#ff2e93' : '#ff7a3d',
        });
      }
    }
    return list;
  }, []);

  const shots: CameraShot[] = [
    {
      // Mysterious silhouette in fog
      from: 8,
      to: 50,
      posStart: [0, 1.5, 4],
      posEnd: [0, 1.7, 2.2],
      lookStart: [0, 1.7, -2],
      lookEnd: [0, 1.8, -2],
      fovStart: 50,
      fovEnd: 45,
      shake: 0.008,
    },
    {
      // Pull-back & crane-up revealing massive sign and crowd
      from: 50,
      to: 190,
      posStart: [0, 1.8, 2],
      posEnd: [0, 8, 14],
      lookStart: [0, 3, -4],
      lookEnd: [0, 4.5, -8],
      fovStart: 55,
      fovEnd: 62,
      shake: frame > 70 && frame < 90 ? 0.03 : 0.01,
    },
  ];

  const qFlicker = frame >= 50 && frame < 70 ? (Math.sin(frame * 1.5) > 0 ? '???' : '') : '???';

  return (
    <AbsoluteFill style={{ backgroundColor: '#07030f', overflow: 'hidden' }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights fogColor="#2a0845" fogNear={3} fogFar={35} />
        <CameraRig frame={frame} shots={shots} />

        {/* Cyan Halo Behind Silhouette in Part 1 (f8-f50) */}
        {frame < 50 && (
          <mesh position={[0, 1.8, -3]}>
            <ringGeometry args={[0.8, 2.2, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.65} />
          </mesh>
        )}

        {/* Central Mysterious Silhouette */}
        {frame < 50 && (
          <Humanoid
            frame={frame}
            pose="idle"
            position={[0, 0, 0]}
            rotation={[0, Math.PI, 0]}
            shirtColor="#0f051d"
            pantsColor="#0f051d"
          />
        )}

        {/* Stage 2: Neon Sign structure & Crowd (f50-f190) */}
        {frame >= 50 && (
          <>
            {/* Neon Sign Base Frame */}
            <mesh position={[0, 5, -8]}>
              <boxGeometry args={[10, 3.5, 0.4]} />
              <meshStandardMaterial color="#120524" roughness={0.8} />
            </mesh>

            {/* Neon Tubes */}
            <mesh position={[-3, 5, -7.7]}>
              <boxGeometry args={[2.2, 2.5, 0.2]} />
              <meshBasicMaterial color={tubeLight1 ? '#ff2e93' : '#22081c'} />
            </mesh>
            <mesh position={[0, 5, -7.7]}>
              <boxGeometry args={[2.2, 2.5, 0.2]} />
              <meshBasicMaterial color={tubeLight2 ? '#00e5ff' : '#082028'} />
            </mesh>
            <mesh position={[3, 5, -7.7]}>
              <boxGeometry args={[2.2, 2.5, 0.2]} />
              <meshBasicMaterial color={tubeLight3 ? '#ff7a3d' : '#281408'} />
            </mesh>

            {/* Crowd of Humanoids facing neon sign in shock */}
            {crowd.map((item, idx) => (
              <Humanoid
                key={idx}
                frame={frame + idx * 2}
                pose="shock"
                position={[item.x, 0, item.z]}
                rotation={[0, Math.PI, 0]}
                skinColor={item.skin}
                shirtColor={item.shirt}
              />
            ))}
          </>
        )}
      </ThreeCanvas>

      {/* Floating Mysterious Text Overlay (f8-f50) */}
      {frame >= 8 && frame < 50 && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            width: '100%',
            textAlign: 'center',
            fontSize: 100,
            fontFamily: 'Impact, sans-serif',
            color: '#00e5ff',
            textShadow: '0 0 30px #00e5ff, 0 0 60px #ff2e93',
            letterSpacing: 10,
          }}
        >
          {qFlicker}
        </div>
      )}
    </AbsoluteFill>
  );
};
