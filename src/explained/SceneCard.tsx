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

  // Entrada con rebote controlado
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 110,
      mass: 0.85,
    },
  });

  // Entrada escalonada de elementos
  const titleEntrance = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Salida suave antes del cambio de escena
  const exitFrames = 12;
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
    interpolate(entrance, [0, 1], [50, 0]) - exitProgress * 40;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        /* Márgenes seguros para TikTok/Reels/Facebook (evita botones laterales, header y pie) */
        padding: '170px 76px 240px 76px',
        boxSizing: 'border-box',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerTranslateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Header de escena con badge y contador */}
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
              backgroundColor: `${scene.accentColor}20`,
              color: scene.accentColor,
              border: `2px solid ${scene.accentColor}`,
              padding: '10px 22px',
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {scene.tag}
          </span>

          <span
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 700,
              letterSpacing: 1.5,
            }}
          >
            {sceneIndex + 1} / {totalScenes}
          </span>
        </div>

        {/* Título Principal */}
        <h1
          style={{
            fontSize: 66,
            lineHeight: 1.15,
            fontWeight: 900,
            letterSpacing: -1.8,
            margin: '8px 0 0 0',
            opacity: interpolate(titleEntrance, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(
              titleEntrance,
              [0, 1],
              [24, 0]
            )}px)`,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          {scene.title}
        </h1>

        {/* Descripción legible */}
        <p
          style={{
            fontSize: 34,
            lineHeight: 1.4,
            color: '#cbd5e1',
            margin: 0,
            fontWeight: 400,
          }}
        >
          {scene.description}
        </p>

        {/* Bloque estadístico si aplica */}
        {scene.stat && (
          <div
            style={{
              marginTop: 8,
              padding: '24px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              opacity: interpolate(cardEntrance, [0, 1], [0, 1]),
              transform: `scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: scene.accentColor,
                lineHeight: 1,
              }}
            >
              {scene.stat}
            </span>
            <span
              style={{
                fontSize: 26,
                lineHeight: 1.3,
                color: '#e2e8f0',
                fontWeight: 600,
              }}
            >
              {scene.statLabel}
            </span>
          </div>
        )}

        {/* Tarjeta de punto clave */}
        {scene.highlightText && (
          <div
            style={{
              padding: '22px 28px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 18,
              borderLeft: `8px solid ${scene.accentColor}`,
              fontSize: 30,
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            💡 {scene.highlightText}
          </div>
        )}
      </div>

      {/* Call to action de cierre en la parte inferior de la zona segura */}
      {scene.callToAction && (
        <div
          style={{
            textAlign: 'center',
            backgroundColor: `${scene.accentColor}25`,
            border: `2px dashed ${scene.accentColor}`,
            padding: '20px 24px',
            borderRadius: 20,
            fontSize: 27,
            fontWeight: 700,
            color: '#ffffff',
            opacity: interpolate(cardEntrance, [0, 1], [0, 1]),
          }}
        >
          {scene.callToAction}
        </div>
      )}
    </AbsoluteFill>
  );
};
