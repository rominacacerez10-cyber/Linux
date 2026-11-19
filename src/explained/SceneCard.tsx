import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Scene } from './data';

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  sceneIndex,
  totalScenes,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada con spring rápido y contundente
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
      mass: 0.75,
    },
  });

  const titleEntrance = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 13, stiffness: 130 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // Salida rápida antes del corte de escena
  const exitFrames = 10;
  const exitProgress = interpolate(
    frame,
    [scene.durationInFrames - exitFrames, scene.durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const containerOpacity =
    interpolate(entrance, [0, 1], [0, 1]) * (1 - exitProgress);
  const containerTranslateY =
    interpolate(entrance, [0, 1], [40, 0]) - exitProgress * 30;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        /* Márgenes seguros para TikTok, Reels y Facebook */
        padding: '175px 76px 250px 76px',
        boxSizing: 'border-box',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Impact, sans-serif',
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerTranslateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {/* Cabecera con Badge neón y contador */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: `${scene.accentColor}25`,
              color: scene.accentColor,
              border: `2px solid ${scene.accentColor}`,
              padding: '10px 24px',
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 2.2,
              textTransform: 'uppercase',
              boxShadow: `0 0 20px ${scene.accentColor}40`,
            }}
          >
            {scene.tag}
          </span>

          <span
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            PARTE {sceneIndex + 1}/{totalScenes}
          </span>
        </div>

        {/* Título de impacto estilo Vice City */}
        <h1
          style={{
            fontSize: 68,
            lineHeight: 1.1,
            fontWeight: 950,
            letterSpacing: -2,
            margin: '6px 0 0 0',
            textTransform: 'uppercase',
            opacity: interpolate(titleEntrance, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(
              titleEntrance,
              [0, 1],
              [24, 0]
            )}px)`,
            textShadow: `0 0 28px ${scene.accentColor}50, 0 4px 18px rgba(0,0,0,0.8)`,
          }}
        >
          {scene.title}
        </h1>

        {/* Descripción callejera legible */}
        <p
          style={{
            fontSize: 35,
            lineHeight: 1.38,
            color: '#e2e8f0',
            margin: 0,
            fontWeight: 500,
          }}
        >
          {scene.description}
        </p>

        {/* Estadísticas / Dato curioso */}
        {scene.stat && (
          <div
            style={{
              marginTop: 6,
              padding: '24px 30px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: `2px solid ${scene.accentColor}55`,
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              opacity: interpolate(cardEntrance, [0, 1], [0, 1]),
              transform: `scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px ${scene.accentColor}15`,
            }}
          >
            <span
              style={{
                fontSize: 66,
                fontWeight: 950,
                color: scene.accentColor,
                lineHeight: 1,
                letterSpacing: -1,
                textShadow: `0 0 20px ${scene.accentColor}60`,
              }}
            >
              {scene.stat}
            </span>
            <span
              style={{
                fontSize: 27,
                lineHeight: 1.3,
                color: '#f8fafc',
                fontWeight: 700,
              }}
            >
              {scene.statLabel}
            </span>
          </div>
        )}

        {/* Tarjeta de dato destacado */}
        {scene.highlightText && (
          <div
            style={{
              padding: '22px 26px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 18,
              borderLeft: `10px solid ${scene.accentColor}`,
              fontSize: 31,
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            }}
          >
            ⚡ {scene.highlightText}
          </div>
        )}
      </div>

      {/* Call to action de cierre en zona segura */}
      {scene.callToAction && (
        <div
          style={{
            textAlign: 'center',
            backgroundColor: `${scene.accentColor}25`,
            border: `3px solid ${scene.accentColor}`,
            padding: '22px 26px',
            borderRadius: 22,
            fontSize: 30,
            fontWeight: 900,
            color: '#ffffff',
            boxShadow: `0 0 25px ${scene.accentColor}60`,
            opacity: interpolate(cardEntrance, [0, 1], [0, 1]),
          }}
        >
          {scene.callToAction}
        </div>
      )}
    </AbsoluteFill>
  );
};
