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

  // Progreso general continuo del video de 0 a 100%
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
        backgroundColor: '#07090e',
        backgroundImage:
          'radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.12), transparent 45%), radial-gradient(circle at 80% 85%, rgba(168, 85, 247, 0.1), transparent 40%)',
        overflow: 'hidden',
      }}
    >
      {/* Barra de progreso superior interactiva (dentro de safe zone superior) */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 60,
          right: 60,
          height: 8,
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
            backgroundColor: '#38bdf8',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.8)',
            borderRadius: 999,
          }}
        />
      </div>

      {/* Secuencia cronológica de escenas */}
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
