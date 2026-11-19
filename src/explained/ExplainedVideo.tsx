import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from 'remotion';
import { EXPLAINED_SCENES, TOTAL_DURATION_IN_FRAMES } from './data';
import { SceneCard } from './SceneCard';

export const EXPLAINED_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: TOTAL_DURATION_IN_FRAMES,
};

export const ExplainedVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Barra continua superior de 0% a 100%
  const globalProgress = interpolate(
    frame,
    [0, TOTAL_DURATION_IN_FRAMES - 1],
    [0, 100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07060f',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255, 42, 133, 0.22), transparent 45%), radial-gradient(circle at 80% 75%, rgba(0, 240, 255, 0.18), transparent 45%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.12), transparent 50%)',
        overflow: 'hidden',
      }}
    >
      {/* Barra de progreso superior en safe-margin */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 64,
          right: 64,
          height: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 999,
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: `${globalProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff2a85, #00f0ff)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.9)',
            borderRadius: 999,
          }}
        />
      </div>

      {/* Secuencia continua de escenas */}
      <Series>
        {EXPLAINED_SCENES.map((scene, index) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneCard
              scene={scene}
              sceneIndex={index}
              totalScenes={EXPLAINED_SCENES.length}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
