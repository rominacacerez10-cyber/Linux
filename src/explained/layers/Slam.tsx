import React from 'react';
import { AbsoluteFill, spring, random, interpolate } from 'remotion';
import { FPS, SAFE } from '../data';
import { theme } from '../../theme';

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
  positionY = 230,
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

  // Entrada multi-propiedad (escala + translateY + opacidad) con spring cinematográfico
  const scale = spring({
    frame: relFrame,
    fps: FPS,
    config: theme.spring.slam,
    from: 2.2,
    to: 1.0,
  });

  const entranceY = interpolate(scale, [1.0, 2.2], [0, 35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const entranceOpacity = interpolate(scale, [1.0, 1.3, 2.2], [1.0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Micro-movimiento orgánico de respiración si permanece en pantalla > 1s (Regla 7: Idle elements breathe)
  const idleBreathe = Math.sin(relFrame * 0.12) * 2.5;

  // Shake con decaimiento determinista en los primeros frames tras el impacto
  let shakeX = 0;
  let shakeY = 0;
  if (relFrame <= shakeDecayFrames) {
    const decay = 1 - relFrame / shakeDecayFrames;
    shakeX = (random(`slam-x-${frame}`) * 2 - 1) * shakeIntensity * decay;
    shakeY = (random(`slam-y-${frame}`) * 2 - 1) * shakeIntensity * decay;
  }

  // Salida rápida y limpia (Regla 4: Exits are faster than entrances ~8-10f)
  const fadeOutStart = durationInFrames - 6;
  const exitOpacity =
    relFrame >= fadeOutStart
      ? 1 - (relFrame - fadeOutStart) / 6
      : 1;

  const totalOpacity = entranceOpacity * exitOpacity;

  // Tamaño de fuente calibrado dentro de SAFE zone
  const calculatedFontSize =
    text.trim().toUpperCase() === 'HORA 0' && fontSize === 94
      ? 110
      : fontSize;

  // Tercio superior estricto (12% del alto = 230 px) para jamás
  // solaparse con los subtítulos principales ubicados en Y=1300
  const clampedY = Math.min(
    Math.max(positionY, 210),
    300
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
          paddingLeft: 40,
          paddingRight: 40,
          boxSizing: 'border-box',
          transform: `translate(${shakeX}px, ${shakeY + entranceY + idleBreathe}px) scale(${scale})`,
          opacity: totalOpacity,
          lineHeight: 0.95,
        }}
      >
        {/* Capa de aberración cromática Cyan desplazada a la derecha */}
        {aberration > 0 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: theme.fonts.display,
              fontSize: calculatedFontSize,
              fontWeight: 900,
              letterSpacing: 4,
              color: glowColor,
              transform: `translate(${aberration}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.75,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
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
              fontFamily: theme.fonts.display,
              fontSize: calculatedFontSize,
              fontWeight: 900,
              letterSpacing: 4,
              color: accentColor,
              transform: `translate(${-aberration}px, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.75,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        )}

        {/* Capa Falso Glow calibrada (Regla: solo un elemento con glow dominante) */}
        <div
          style={{
            position: 'absolute',
            fontFamily: theme.fonts.display,
            fontSize: calculatedFontSize,
            fontWeight: 900,
            letterSpacing: 4,
            color: accentColor,
            filter: `blur(16px)`,
            opacity: 0.85,
            mixBlendMode: 'screen',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </div>

        {/* Capa de texto principal sólida con borde oscuro */}
        <div
          style={{
            position: 'relative',
            fontFamily: theme.fonts.display,
            fontSize: calculatedFontSize,
            fontWeight: 900,
            letterSpacing: 4,
            color,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: `0 0 16px ${accentColor}, 0 0 35px ${glowColor}, 4px 4px 0 #07030f, -4px -4px 0 #07030f, 4px -4px 0 #07030f, -4px 4px 0 #07030f, 0 10px 22px rgba(0,0,0,0.95)`,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
