import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import {
  FPS,
  HEIGHT,
  SAFE,
  SCENES,
  SCENE_STARTS,
  TOTAL_FRAMES,
  WIDTH,
} from './data';
import { SceneCard } from './SceneCard';

export const EXPLAINED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
};

export const ExplainedVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Barra continua superior de progreso global sincronizada de frame 0 al total
  const globalProgress = interpolate(frame, [0, TOTAL_FRAMES - 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07030f',
        overflow: 'hidden',
      }}
    >
      {/* Barra de progreso global neón en el margen superior seguro */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: SAFE.left,
          right: SAFE.right,
          height: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 999,
          overflow: 'hidden',
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: `${globalProgress}%`,
            height: '100%',
            background:
              'linear-gradient(90deg, #ff2e93 0%, #ff7a3d 50%, #00e5ff 100%)',
            boxShadow: '0 0 20px #00e5ff',
            borderRadius: 999,
          }}
        />
      </div>

      {/* Renderizado de secuencias exactas sin solapamiento ni desfaces */}
      {SCENES.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={SCENE_STARTS[index]}
          durationInFrames={scene.frames}
        >
          <SceneCard
            scene={scene}
            sceneIndex={index}
            totalScenes={SCENES.length}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
