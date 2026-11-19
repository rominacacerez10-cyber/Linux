import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Scene } from './data';

interface SceneCardProps {
  scene: Scene;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada suave
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 90,
      mass: 0.8,
    },
  });

  // Animación de salida en los últimos 15 frames
  const exitProgress = interpolate(
    frame,
    [scene.durationInFrames - 15, scene.durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(entrance, [0, 1], [0, 1]) * (1 - exitProgress);
  const translateY = interpolate(entrance, [0, 1], [60, 0]) - exitProgress * 40;
  const scale = interpolate(entrance, [0, 1], [0.96, 1]) + exitProgress * 0.05;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 920,
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <span
          style={{
            alignSelf: 'flex-start',
            backgroundColor: `${scene.accentColor}22`,
            color: scene.accentColor,
            border: `1.5px solid ${scene.accentColor}`,
            padding: '10px 24px',
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {scene.tag}
        </span>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            margin: 0,
          }}
        >
          {scene.title}
        </h1>

        <p
          style={{
            fontSize: 38,
            color: '#cbd5e1',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {scene.description}
        </p>

        {scene.highlightText && (
          <div
            style={{
              marginTop: 12,
              padding: '20px 28px',
              backgroundColor: '#171722',
              borderRadius: 16,
              borderLeft: `6px solid ${scene.accentColor}`,
              fontSize: 32,
              fontWeight: 600,
              color: scene.accentColor,
            }}
          >
            {scene.highlightText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
