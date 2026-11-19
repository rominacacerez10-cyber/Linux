import React from 'react';
import { Composition } from 'remotion';
import { ExplainedVideo } from './explained/ExplainedVideo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ExplainedShort"
        component={ExplainedVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
