import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS, SCENES, SCENE_STARTS, VO_DELAY } from './data';
import { VO_TIMINGS } from './timings';

const FONT_DISPLAY =
  'Anton, Impact, "Arial Black", -apple-system, sans-serif';

interface WordInfo {
  text: string;
  globalStartFrame: number;
  globalEndFrame: number;
  accentColor: string;
}

export const Captions: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Aplanar las palabras con sus frames globales exactos
  const allWords: WordInfo[] = [];

  VO_TIMINGS.forEach((timing) => {
    const sceneIndex = timing.scene - 1;
    const sceneStart = SCENE_STARTS[sceneIndex];
    const delay = VO_DELAY[timing.scene] ?? 0;
    const voStartFrame = sceneStart + delay;
    const accent = SCENES[sceneIndex]?.accent ?? '#ff2e93';

    timing.words.forEach((w) => {
      const globalStartFrame = voStartFrame + Math.round(w.startSec * FPS);
      const globalEndFrame = voStartFrame + Math.round(w.endSec * FPS);
      allWords.push({
        text: w.text,
        globalStartFrame,
        globalEndFrame,
        accentColor: accent,
      });
    });
  });

  // Encontrar el índice de la palabra activa en el frame actual
  const activeIndex = allWords.findIndex(
    (w) =>
      currentFrame >= w.globalStartFrame && currentFrame < w.globalEndFrame
  );

  if (activeIndex === -1) {
    return null;
  }

  // Agrupar 2 palabras a la vez sin encimarse
  const windowSize = 2;
  const chunkIndex = Math.floor(activeIndex / windowSize);
  const startIndex = chunkIndex * windowSize;
  const visibleWords = allWords.slice(startIndex, startIndex + windowSize);

  return (
    <div
      style={{
        position: 'absolute',
        top: 1140,
        left: 60,
        right: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 20,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {visibleWords.map((word, idx) => {
        const isCurrent =
          currentFrame >= word.globalStartFrame &&
          currentFrame < word.globalEndFrame;

        const isPast = currentFrame >= word.globalEndFrame;

        const pop = isCurrent
          ? spring({
              frame: currentFrame - word.globalStartFrame,
              fps,
              config: { damping: 10, stiffness: 180, mass: 0.5 },
            })
          : 0;

        const scale = isCurrent ? interpolate(pop, [0, 1], [0.95, 1.1]) : 1.0;
        const color = isCurrent ? word.accentColor : isPast ? '#ffffff' : 'rgba(255,255,255,0.45)';

        return (
          <span
            key={`${word.text}-${idx}-${word.globalStartFrame}`}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 58,
              lineHeight: 1.1,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color,
              transform: `scale(${scale})`,
              display: 'inline-block',
              whiteSpace: 'nowrap',
              textShadow: isCurrent
                ? `0 0 24px ${word.accentColor}, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 8px 18px rgba(0,0,0,0.9)`
                : '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 6px 12px rgba(0,0,0,0.8)',
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
