import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Scene, WIDTH, HEIGHT } from './data';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Scene04 } from './scenes/Scene04';
import { Scene05 } from './scenes/Scene05';
import { Scene06 } from './scenes/Scene06';

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

export const SceneCard: React.FC<SceneCardProps> = ({ sceneIndex }) => {
  if (sceneIndex === 0) {
    return <Scene01 />;
  }
  if (sceneIndex === 1) {
    return <Scene02 />;
  }
  if (sceneIndex === 2) {
    return <Scene03 />;
  }
  if (sceneIndex === 3) {
    return <Scene04 />;
  }
  if (sceneIndex === 4) {
    return <Scene05 />;
  }
  if (sceneIndex === 5) {
    return <Scene06 />;
  }

  return null;
};
