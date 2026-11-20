import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, random } from 'remotion';

export interface FxProps {
  frame: number;
  width?: number;
  height?: number;
  grainOpacity?: number;
  halftoneOpacity?: number;
  vignetteOpacity?: number;
  speedLinesOpacity?: number;
  lightLeakOpacity?: number;
  flashOpacity?: number;
  flashColor?: string;
  glitchActive?: boolean;
  glitchSlices?: number;
  chromaticShift?: number;
  whipBlur?: number;
}

export const Fx: React.FC<FxProps> = ({
  frame,
  width = 1080,
  height = 1920,
  grainOpacity = 0.16,
  halftoneOpacity = 0.12,
  vignetteOpacity = 0.45,
  speedLinesOpacity = 0,
  lightLeakOpacity = 0.25,
  flashOpacity = 0,
  flashColor = '#ffffff',
  glitchActive = false,
  glitchSlices = 7,
  chromaticShift = 0,
  whipBlur = 0,
}) => {
  // 1. Grano de película animado con SVG feTurbulence determinista
  const grainSeed = Math.floor(frame * 7) % 1000;

  // 2. Glitch por slices horizontales aleatorios deterministas
  const slices = useMemo(() => {
    if (!glitchActive) return [];
    const list: Array<{ top: number; height: number; shiftX: number; rgbColor: string }> = [];
    for (let i = 0; i < glitchSlices; i++) {
      const seed = `slice-${frame}-${i}`;
      const top = random(`${seed}-top`) * 100;
      const h = 2 + random(`${seed}-h`) * 6;
      const shiftX = (random(`${seed}-sx`) - 0.5) * 36;
      const colors = ['rgba(255, 46, 147, 0.4)', 'rgba(0, 229, 255, 0.4)', 'rgba(255, 122, 61, 0.4)'];
      const rgbColor = colors[Math.floor(random(`${seed}-col`) * colors.length)];
      list.push({ top, height: h, shiftX, rgbColor });
    }
    return list;
  }, [glitchActive, glitchSlices, frame]);

  // 3. Light leak orgánico que pulsa con el frame
  const leakX = interpolate((frame * 1.5) % 120, [0, 60, 120], [-10, 20, -10]);
  const leakY = interpolate((frame * 1.2) % 90, [0, 45, 90], [10, -15, 10]);

  // 4. Whip pan blur style
  const blurPx = Math.max(0, whipBlur);

  // 5. Protección del cierre: en el último tramo nunca permitimos
  // flashes blancos ni light leaks intensos que laven el plano.
  const isFinale = frame >= 900;
  const safeFlashOpacity = isFinale
    ? 0
    : Math.min(0.45, Math.max(0, flashOpacity));
  const safeLightLeak = isFinale
    ? Math.min(0.05, Math.max(0, lightLeakOpacity))
    : lightLeakOpacity;
  const safeVignette = isFinale
    ? Math.max(0.55, vignetteOpacity)
    : vignetteOpacity;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        overflow: 'hidden',
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
      }}
    >
      {/* Halftone dot pattern decorativo en sombras */}
      {halftoneOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: halftoneOpacity,
            mixBlendMode: 'overlay',
            backgroundImage: `radial-gradient(circle, rgba(255, 46, 147, 0.5) 1.5px, transparent 1.5px)`,
            backgroundSize: '12px 12px',
          }}
        />
      )}

      {/* Light Leaks Synthwave (Magenta / Naranja / Cian) */}
      {safeLightLeak > 0 && (
        <AbsoluteFill
          style={{
            opacity: safeLightLeak,
            mixBlendMode: 'screen',
            background: `radial-gradient(circle at ${30 + leakX}% ${20 + leakY}%, rgba(255, 46, 147, 0.6) 0%, transparent 60%),
                         radial-gradient(circle at ${80 - leakX}% ${75 - leakY}%, rgba(0, 229, 255, 0.5) 0%, transparent 55%),
                         radial-gradient(circle at 50% 90%, rgba(255, 122, 61, 0.45) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Líneas de velocidad centradas */}
      {speedLinesOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: speedLinesOpacity,
            mixBlendMode: 'screen',
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(0, 229, 255, 0.3) 0deg 2deg, transparent 2deg 12deg, rgba(255, 46, 147, 0.25) 12deg 14deg, transparent 14deg 24deg)`,
            maskImage: 'radial-gradient(ellipse at center, transparent 35%, black 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 35%, black 85%)',
          }}
        />
      )}

      {/* Viñeta cinematográfica retro */}
      {safeVignette > 0 && (
        <AbsoluteFill
          style={{
            opacity: safeVignette,
            boxShadow: 'inset 0 0 160px 40px #07030f, inset 0 0 280px 80px rgba(42, 8, 69, 0.7)',
          }}
        />
      )}

      {/* Aberración cromática por capas RGB en toda la pantalla cuando hay shift */}
      {chromaticShift > 0 && (
        <>
          <AbsoluteFill
            style={{
              mixBlendMode: 'screen',
              transform: `translate(${-chromaticShift}px, 0)`,
              opacity: 0.35,
              backgroundColor: 'rgba(255, 46, 147, 0.12)',
            }}
          />
          <AbsoluteFill
            style={{
              mixBlendMode: 'screen',
              transform: `translate(${chromaticShift}px, 0)`,
              opacity: 0.35,
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
            }}
          />
        </>
      )}

      {/* Glitch por slices horizontales */}
      {glitchActive &&
        slices.map((slice, i) => (
          <div
            key={`glitch-slice-${i}`}
            style={{
              position: 'absolute',
              top: `${slice.top}%`,
              left: 0,
              width: '100%',
              height: `${slice.height}%`,
              backgroundColor: slice.rgbColor,
              mixBlendMode: 'screen',
              transform: `translateX(${slice.shiftX}px)`,
              boxShadow: '0 0 12px rgba(255, 46, 147, 0.5)',
            }}
          />
        ))}

      {/* Color Grade cinematográfico (5-layer stack: curva de contraste y saturación sutil) */}
      <AbsoluteFill
        style={{
          backdropFilter: 'contrast(1.08) saturate(1.15)',
          pointerEvents: 'none',
        }}
      />

      {/* Grano de película animado vía SVG feTurbulence determinista */}
      {grainOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: grainOpacity,
            mixBlendMode: 'overlay',
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ width: '100%', height: '100%' }}
          >
            <filter id={`grain-filter-${frame % 20}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves={3}
                seed={grainSeed}
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#grain-filter-${frame % 20})`}
            />
          </svg>
        </AbsoluteFill>
      )}

      {/* Flash blanco / de color */}
      {safeFlashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: flashColor,
            opacity: safeFlashOpacity,
            mixBlendMode: 'lighten',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
