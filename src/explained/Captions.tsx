import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS, SCENES, SCENE_STARTS, VO_DELAY } from './data';
import { VO_TIMINGS } from './timings';
import { theme } from '../theme';

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
        text: String(w.text ?? '').trim(),
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

  // Agrupar 2 palabras a la vez con separación visual limpia y amplia
  const windowSize = 2;
  const chunkIndex = Math.floor(activeIndex / windowSize);
  const startIndex = chunkIndex * windowSize;
  const visibleWords = allWords.slice(startIndex, startIndex + windowSize);

  // Tamaño adaptativo: evita que dos palabras largas desborden y se toquen
  const visibleLength = visibleWords.reduce(
    (total, word) => total + word.text.length,
    0
  );
  const fontSize =
    visibleLength > 24 ? 52 : visibleLength > 18 ? 58 : visibleLength > 12 ? 64 : 70;

  return (
    <div
      style={{
        position: 'absolute',
        top: 1300,
        left: 0,
        width: '100%',
        paddingLeft: 36,
        paddingRight: 36,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 36,
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
              config: theme.spring.snappy,
            })
          : 0;

        const scale = isCurrent ? interpolate(pop, [0, 1], [0.96, 1.12]) : 1.0;
        const color = isCurrent
          ? word.accentColor
          : isPast
            ? '#ffffff'
            : 'rgba(255,255,255,0.4)';

        return (
          <React.Fragment key={`${word.text}-${idx}-${word.globalStartFrame}`}>
            {/* Separador físico: garantiza espacio incluso si el motor ignora gap */}
            {idx > 0 && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 22,
                  flex: '0 0 22px',
                }}
              />
            )}
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize,
                lineHeight: 1.08,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 2,
                color,
                transform: `scale(${scale})`,
                display: 'inline-block',
                flex: '0 0 auto',
                whiteSpace: 'nowrap',
                padding: '6px 16px',
                boxSizing: 'content-box',
                // Contorno negro grueso + sombras duras para legibilidad total sobre neón
                WebkitTextStroke: '12px #000000',
                paintOrder: 'stroke fill',
                textShadow: isCurrent
                  ? `0 0 32px ${word.accentColor}, 0 0 12px ${word.accentColor}, 4px 4px 0 #000, -4px 4px 0 #000, 0 9px 18px rgba(0,0,0,0.98)`
                  : '4px 4px 0 #000, -4px 4px 0 #000, 0 7px 16px rgba(0,0,0,0.98)',
                filter: 'drop-shadow(0 7px 14px rgba(0,0,0,0.98))',
              }}
            >
              {word.text}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
