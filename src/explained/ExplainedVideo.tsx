import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { AudioTrack } from './AudioTrack';
import { Captions } from './Captions';
import {
  FPS,
  HEIGHT,
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
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07030f',
        overflow: 'hidden',
      }}
    >
      {/* Secuencias visuales de escenas sin solapamiento */}
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

      {/* Capa de subtítulos karaoke palabra por palabra */}
      <Captions />

      {/* Capa de Audio global (Música con ducking, VO sincronizada por escena, y SFX) */}
      <AudioTrack />
    </AbsoluteFill>
  );
};
