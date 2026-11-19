import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { EXPLAINED_SCENES } from './data';
import { SceneCard } from './SceneCard';

export const EXPLAINED_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 300, // Total 10 segundos
};

export const ExplainedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0f' }}>
      <Series>
        {EXPLAINED_SCENES.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneCard scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
