import React from 'react';
import { Composition } from 'remotion';
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './explained/data';
import { ExplainedVideo } from './explained/ExplainedVideo';
import { TestShot } from './explained/world3d/TestShot';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ExplainedShort"
        component={ExplainedVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Test3D"
        component={TestShot}
        durationInFrames={300}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
