import React from 'react';
import { Composition } from 'remotion';
import { TOTAL_DURATION_IN_FRAMES } from './explained/data';
import { EXPLAINED_CONFIG, ExplainedVideo } from './explained/ExplainedVideo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ExplainedShort"
        component={ExplainedVideo}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={EXPLAINED_CONFIG.fps}
        width={EXPLAINED_CONFIG.width}
        height={EXPLAINED_CONFIG.height}
      />
    </>
  );
};
