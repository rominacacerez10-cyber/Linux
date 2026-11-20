import React from "react";
import {Composition} from "remotion";
import {FPS, HEIGHT, WIDTH} from "../explained/data";
import {Pilot01} from "./Pilot01";
import {Pilot02} from "./Pilot02";

export const PilotRoot: React.FC = () => (
  <>
    <Composition id="Pilot01" component={Pilot01} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Pilot02" component={Pilot02} durationInFrames={180} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
