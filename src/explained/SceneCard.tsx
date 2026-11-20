import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene } from './data';

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

// SceneCard mínimo que actúa como placeholder mientras se implementan
// las escenas 3D en las etapas 06 y 07
export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  sceneIndex,
  totalScenes,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07030f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'Anton, Impact, sans-serif',
      }}
    >
      <div
        style={{
          border: `3px solid ${scene.accent}`,
          padding: '24px 48px',
          borderRadius: 20,
          background: 'rgba(255, 46, 147, 0.08)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: scene.accent2,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          ESCENA 0{sceneIndex + 1} / 0{totalScenes} ({scene.frames}f)
        </div>
        <div
          style={{
            fontSize: 48,
            color: scene.accent,
            textShadow: `0 0 30px ${scene.accent}`,
          }}
        >
          {scene.id.toUpperCase()}
        </div>
      </div>
    </AbsoluteFill>
  );
};
