import React from 'react';
import { AbsoluteFill, spring, random } from 'remotion';
import { FPS, SAFE } from '../data';

export interface SlamProps {
  frame: number;
  text: string;
  startFrame?: number;
  durationInFrames?: number;
  color?: string;
  accentColor?: string;
  glowColor?: string;
  fontSize?: number;
  positionY?: number; // Centro Y en coordenadas de pantalla
  shakeIntensity?: number;
  shakeDecayFrames?: number;
  aberration?: number;
}

export const Slam: React.FC<SlamProps> = ({
  frame,
  text,
  startFrame = 0,
  durationInFrames = 45,
  color = '#ffffff',
  accentColor = '#ff2e93',
  glowColor = '#00e5ff',
  fontSize = 94,
  positionY = 560,
  shakeIntensity = 18,
  shakeDecayFrames = 12,
  aberration = 8,
}) => {
  // Comprobación de tiempo dentro del Slam
  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationInFrames) {
    return null;
  }

  // Validación: máx 4 palabras por regla de DIRECCION.md
  const words = text.trim().split(/\s+/);
  if (words.length > 4) {
    throw new Error(
      `Slam text excede el límite de 4 palabras: "${text}". Máximo permitido: 4 palabras.`
    );
  }

  // Spring explosivo inicial con rebote
  const scale = spring({
    frame: relFrame,
    fps: FPS,
    config: {
      damping: 10,
      mass: 0.4,
      stiffness: 220,
      overshootClamping: false,
    },
    from: 2.8,
    to: 1.0,
  });

  // Shake con decaimiento determinista en los primeros frames tras el impacto
  let shakeX = 0;
  let shakeY = 0;
  if (relFrame <= shakeDecayFrames) {
    const decay = 1 - relFrame / shakeDecayFrames;
    shakeX = (random(`slam-x-${frame}`) * 2 - 1) * shakeIntensity * decay;
    shakeY = (random(`slam-y-${frame}`) * 2 - 1) * shakeIntensity * decay;
  }

  // Opacidad general con fade-out al final
  const fadeOutStart = durationInFrames - 6;
  const opacity =
    relFrame >= fadeOutStart
      ? 1 - (relFrame - fadeOutStart) / 6
      : 1;

  // Asegurar que la posición Y se mantiene dentro de SAFE
  const clampedY = Math.min(
    Math.max(positionY, SAFE.top + 60),
    1920 - SAFE.bottom - 60
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: clampedY,
          left: SAFE.left,
          right: SAFE.right,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
          opacity,
          lineHeight: 0.95,
        }}
      >
        {/* Capa de aberración cromática Cyan desplazada a la derecha */}
        {aberration > 0 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize,
              fontWeight: 900,
              letterSpacing: 4,
              color: glowColor,
              transform: `translate(${aberration}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.75,
              textTransform: 'uppercase',
            }}
          >
            {text}
          </div>
        )}

        {/* Capa de aberración cromática Magenta desplazada a la izquierda */}
        {aberration > 0 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize,
              fontWeight: 900,
              letterSpacing: 4,
              color: accentColor,
              transform: `translate(${-aberration}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.75,
              textTransform: 'uppercase',
            }}
          >
            {text}
          </div>
        )}

        {/* Capa Falso Glow duplicada con blur y screen */}
        <div
          style={{
            position: 'absolute',
            fontFamily: 'Anton, Impact, sans-serif',
            fontSize,
            fontWeight: 900,
            letterSpacing: 4,
            color: accentColor,
            filter: `blur(18px)`,
            opacity: 0.9,
            mixBlendMode: 'screen',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </div>

        {/* Capa de texto principal sólida con borde oscuro */}
        <div
          style={{
            position: 'relative',
            fontFamily: 'Anton, Impact, sans-serif',
            fontSize,
            fontWeight: 900,
            letterSpacing: 4,
            color,
            textTransform: 'uppercase',
            textShadow: `0 0 16px ${accentColor}, 0 0 35px ${glowColor}, 3px 3px 0 #07030f, -3px -3px 0 #07030f, 3px -3px 0 #07030f, -3px 3px 0 #07030f`,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
