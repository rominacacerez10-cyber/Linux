import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
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
import { Fx } from './layers/Fx';
import { Slam } from './layers/Slam';

export const EXPLAINED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
};

export const ExplainedVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // FX Dinámicos coordinados con el storyboard:
  // - Frame 0-14: Flash blanco fuerte en "HORA 0"
  // - Frame 90-96: Glitch al golpear "LOCO"
  // - Frame 116-120: Whip blur en corte
  // - Frame 296-300: Glitch en corte
  // - Frame 445-450: Aberración en "DESMADRE"
  // - Frame 486-490: Whip blur en corte
  // - Frame 608-614: Aberración en "FÍSICAS"
  // - Frame 670-678: Negro total en Escena 5 (giro)
  // - Frame 720-728: Glitch fuerte en revelación de misterio
  // - Frame 740-746: Flash en "¿QUÉ?!"
  const isBlackout = frame >= 670 && frame < 678;

  const flashOpacity = (() => {
    if (frame >= 0 && frame <= 14) return (14 - frame) / 14;
    if (frame >= 740 && frame <= 748) return (748 - frame) / 8;
    return 0;
  })();

  const isGlitching =
    (frame >= 90 && frame <= 96) ||
    (frame >= 296 && frame <= 300) ||
    (frame >= 666 && frame <= 670) ||
    (frame >= 720 && frame <= 728);

  const chromaticShift = (() => {
    if (frame >= 0 && frame <= 14) return 10;
    if (frame >= 90 && frame <= 96) return 14;
    if (frame >= 445 && frame <= 455) return 8;
    if (frame >= 608 && frame <= 620) return 9;
    if (frame >= 720 && frame <= 728) return 16;
    return 0;
  })();

  const whipBlur = (() => {
    if (frame >= 115 && frame <= 120) return (frame - 115) * 3;
    if (frame >= 485 && frame <= 490) return (frame - 485) * 3;
    if (frame >= 855 && frame <= 860) return (frame - 855) * 3;
    return 0;
  })();

  const speedLinesOpacity = (() => {
    // Escena 1 f45-90 a ras de suelo y Escena 2 push-in f60-120 (180-240)
    if (frame >= 45 && frame <= 90) return 0.55;
    if (frame >= 180 && frame <= 240) return 0.7;
    return 0;
  })();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07030f',
        overflow: 'hidden',
      }}
    >
      {/* 8 frames de negro total y silencio antes del giro (Escena 5) */}
      {!isBlackout && (
        <>
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
        </>
      )}

      {/* Slam Words sincronizadas con el storyboard (máx. 4 palabras) */}
      {/* 1. HORA 0 al inicio (f0..30) */}
      <Slam
        frame={frame}
        startFrame={0}
        durationInFrames={30}
        text="HORA 0"
        fontSize={120}
        color="#ffffff"
        accentColor="#ff2e93"
        glowColor="#00e5ff"
        positionY={480}
        shakeIntensity={20}
      />

      {/* 2. LOCO al final de la escena 1 (f90..119) */}
      <Slam
        frame={frame}
        startFrame={90}
        durationInFrames={29}
        text="LOCO"
        fontSize={130}
        color="#ffffff"
        accentColor="#00e5ff"
        glowColor="#ff2e93"
        positionY={520}
        shakeIntensity={16}
      />

      {/* 3. DESMADRE en escena 3 (f445..485) */}
      <Slam
        frame={frame}
        startFrame={445}
        durationInFrames={40}
        text="DESMADRE"
        fontSize={110}
        color="#ffffff"
        accentColor="#ff7a3d"
        glowColor="#ff2e93"
        positionY={500}
        shakeIntensity={18}
      />

      {/* 4. FÍSICAS en escena 4 (f610..660) */}
      <Slam
        frame={frame}
        startFrame={610}
        durationInFrames={50}
        text="FÍSICAS"
        fontSize={120}
        color="#ffffff"
        accentColor="#00e5ff"
        glowColor="#ff2e93"
        positionY={500}
        shakeIntensity={14}
      />

      {/* 5. ¿QUÉ?! en escena 5 (f740..785) */}
      <Slam
        frame={frame}
        startFrame={740}
        durationInFrames={45}
        text="¿QUÉ?!"
        fontSize={130}
        color="#ffffff"
        accentColor="#ff2e93"
        glowColor="#00e5ff"
        positionY={480}
        shakeIntensity={22}
      />

      {/* 6. ¿QUÉ HICISTE PRIMERO? en escena 6 (f920..1000) */}
      <Slam
        frame={frame}
        startFrame={920}
        durationInFrames={80}
        text="¿QUÉ HICISTE PRIMERO?"
        fontSize={72}
        color="#ffffff"
        accentColor="#ff7a3d"
        glowColor="#00e5ff"
        positionY={520}
        shakeIntensity={10}
      />

      {/* Capa de subtítulos karaoke palabra por palabra */}
      <Captions />

      {/* Capa de efectos 2D (grano, halftone, light leaks, glitch, speed lines, viñeta, flash) */}
      <Fx
        frame={frame}
        width={WIDTH}
        height={HEIGHT}
        grainOpacity={0.15}
        halftoneOpacity={0.1}
        vignetteOpacity={0.4}
        speedLinesOpacity={speedLinesOpacity}
        lightLeakOpacity={0.22}
        flashOpacity={flashOpacity}
        glitchActive={isGlitching}
        chromaticShift={chromaticShift}
        whipBlur={whipBlur}
      />

      {/* Capa de Audio global (Música con ducking, VO sincronizada por escena, y SFX) */}
      <AudioTrack />
    </AbsoluteFill>
  );
};
