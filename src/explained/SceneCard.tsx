import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SAFE, Scene } from './data';

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

const FONT_DISPLAY =
  'Impact, "Arial Black", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_BODY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  sceneIndex,
  totalScenes,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Cámara viva (drift, zoom y micro-rotación continua) ---
  const cameraScale = interpolate(frame, [0, scene.frames], [1.0, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraDriftX = interpolate(frame, [0, scene.frames], [-12, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraDriftY = interpolate(frame, [0, scene.frames], [10, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraRot = interpolate(frame, [0, scene.frames], [-0.6, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Transición: Entrada de 10 frames y Salida de 6 frames ---
  const wipeProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flashOpacity = interpolate(frame, [0, 4, 10], [0.95, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitFrames = 6;
  const exitProgress = interpolate(
    frame,
    [scene.frames - exitFrames, scene.frames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // --- Springs escalonados para la composición ---
  const springBase = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  const springTitle = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  const springBody = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  const springPanel = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  // --- Efecto glitch para layout 'reveal' ---
  const revealProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const showGlitchText = revealProgress < 0.6 && frame % 4 < 2;

  // --- Colores de badges ---
  const badgeToneStyles = {
    alert: {
      bg: 'rgba(255, 46, 147, 0.25)',
      border: '#ff2e93',
      color: '#ffffff',
      glow: 'rgba(255, 46, 147, 0.7)',
    },
    hot: {
      bg: 'rgba(255, 122, 61, 0.25)',
      border: '#ff7a3d',
      color: '#fff3ea',
      glow: 'rgba(255, 122, 61, 0.7)',
    },
    meme: {
      bg: 'rgba(255, 230, 0, 0.22)',
      border: '#ffe600',
      color: '#ffffff',
      glow: 'rgba(255, 230, 0, 0.65)',
    },
    info: {
      bg: 'rgba(0, 229, 255, 0.25)',
      border: '#00e5ff',
      color: '#ecfeff',
      glow: 'rgba(0, 229, 255, 0.7)',
    },
  }[scene.badge.tone];

  // --- Movimiento de rejilla synthwave continua (scroll infinito por frame) ---
  const gridOffsetY = (frame * 6) % 90;

  // --- Desplazamiento lento de luces ambientales (Parallax) ---
  const ambientLightX1 = Math.sin((frame / 60) * Math.PI) * 50;
  const ambientLightY1 = Math.cos((frame / 60) * Math.PI) * 40;
  const ambientLightX2 = Math.cos((frame / 50) * Math.PI) * -60;

  // --- Efecto scanlines sutil ---
  const scanlineShift = (frame * 2) % 6;

  // --- Renderizado de Layouts Específicos ---
  const renderLayoutContent = () => {
    switch (scene.layout) {
      case 'impact': {
        const statSpring = spring({
          frame: Math.max(0, frame - 16),
          fps,
          config: { damping: 11, stiffness: 130 },
        });
        const animatedStatNum = Math.floor(
          interpolate(
            statSpring,
            [0, 1],
            [0, scene.stat ? scene.stat.value : 0]
          )
        );

        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: 28,
            }}
          >
            <div
              style={{
                transform: `scale(${interpolate(springTitle, [0, 1], [0.85, 1])})`,
                opacity: interpolate(springTitle, [0, 1], [0, 1]),
              }}
            >
              {scene.headline.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 82,
                    lineHeight: 0.95,
                    fontWeight: 900,
                    letterSpacing: -2,
                    textTransform: 'uppercase',
                    color: idx === 1 ? scene.accent : '#ffffff',
                    textShadow: `0 0 45px ${scene.accent}70, 0 10px 30px rgba(0,0,0,0.9)`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 34,
                lineHeight: 1.35,
                color: '#e2e8f0',
                maxWidth: 720,
                margin: '10px 0 0 0',
                opacity: interpolate(springBody, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(springBody, [0, 1], [24, 0])}px)`,
                fontWeight: 600,
              }}
            >
              {scene.sub}
            </p>

            {scene.stat && (
              <div
                style={{
                  marginTop: 20,
                  padding: '24px 50px',
                  borderRadius: 24,
                  backgroundColor: 'rgba(7, 3, 15, 0.85)',
                  border: `3px solid ${scene.accent}`,
                  boxShadow: `0 0 35px ${scene.accent}45, inset 0 0 25px ${scene.accent}20`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  opacity: interpolate(springPanel, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(springPanel, [0, 1], [0.88, 1])})`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 88,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: scene.accent,
                    textShadow: `0 0 25px ${scene.accent}`,
                  }}
                >
                  {animatedStatNum}
                  {scene.stat.suffix}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 26,
                    lineHeight: 1.25,
                    color: '#f8fafc',
                    fontWeight: 800,
                    textAlign: 'left',
                    maxWidth: 240,
                  }}
                >
                  {scene.stat.label}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'feed': {
        const feedItems = [
          {
            user: '@vice_streamer',
            text: 'SE CAYÓ TODO, 12 HORAS DE COLA 🔥',
            tag: 'EN VIVO',
          },
          {
            user: '@latino_gamer',
            text: 'LA FÍSICA DEL AGUA NO TIENE SENTIDO 🤯',
            tag: 'CLIP VIRAL',
          },
          {
            user: '@city_chaos',
            text: 'YA ROBÉ MI PRIMER HELICÓPTERO EN EL MALL',
            tag: 'TRENDING',
          },
        ];

        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div
              style={{
                opacity: interpolate(springTitle, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(springTitle, [0, 1], [-40, 0])}px)`,
              }}
            >
              {scene.headline.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 74,
                    lineHeight: 0.96,
                    fontWeight: 900,
                    letterSpacing: -1.5,
                    textTransform: 'uppercase',
                    color: idx === 1 ? scene.accent : '#ffffff',
                    textShadow: `0 0 35px ${scene.accent}60`,
                  }}
                >
                  {line}
                </div>
              ))}
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 30,
                  color: '#cbd5e1',
                  margin: '12px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {scene.sub}
              </p>
            </div>

            {/* Tarjetas simulando feeds apilados en cascada */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {feedItems.map((item, idx) => {
                const staggerSpring = spring({
                  frame: Math.max(0, frame - 10 - idx * 6),
                  fps,
                  config: { damping: 13, stiffness: 140 },
                });
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '20px 24px',
                      borderRadius: 18,
                      backgroundColor: 'rgba(20, 10, 35, 0.85)',
                      border: `2px solid ${idx === 0 ? scene.accent : 'rgba(255,255,255,0.15)'}`,
                      boxShadow:
                        idx === 0
                          ? `0 0 25px ${scene.accent}40`
                          : '0 10px 25px rgba(0,0,0,0.4)',
                      opacity: interpolate(staggerSpring, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(
                        staggerSpring,
                        [0, 1],
                        [80, 0]
                      )}px)`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 22,
                          fontWeight: 800,
                          color: scene.accent,
                        }}
                      >
                        {item.user}
                      </span>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: 999,
                          backgroundColor: `${scene.accent}30`,
                          color: '#ffffff',
                          border: `1px solid ${scene.accent}80`,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 26,
                        fontWeight: 700,
                        color: '#f8fafc',
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {scene.stat && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 28px',
                  borderRadius: 16,
                  backgroundColor: `${scene.accent}15`,
                  border: `2px dashed ${scene.accent}`,
                  opacity: interpolate(springPanel, [0, 1], [0, 1]),
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 25,
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  ⚡ {scene.stat.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 52,
                    fontWeight: 900,
                    color: scene.accent,
                  }}
                >
                  +{scene.stat.value}
                  {scene.stat.suffix}
                </span>
              </div>
            )}
          </div>
        );
      }

      case 'contrast': {
        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              gap: 20,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(springTitle, [0, 1], [0, 1]),
                transform: `scale(${interpolate(springTitle, [0, 1], [0.92, 1])})`,
              }}
            >
              {scene.headline.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 72,
                    lineHeight: 0.95,
                    fontWeight: 900,
                    letterSpacing: -1.5,
                    color: idx === 1 ? scene.accent : '#ffffff',
                    textShadow: `0 0 35px ${scene.accent}65`,
                  }}
                >
                  {line}
                </div>
              ))}
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 29,
                  color: '#e2e8f0',
                  margin: '12px auto 0 auto',
                  fontWeight: 600,
                }}
              >
                {scene.sub}
              </p>
            </div>

            {/* Comparación dividida en diagonal */}
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 18,
                marginTop: 10,
              }}
            >
              <div
                style={{
                  padding: '28px 20px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(255, 46, 147, 0.18)',
                  border: '2px solid #ff2e93',
                  boxShadow: '0 0 30px rgba(255, 46, 147, 0.35)',
                  transform: `translateY(${interpolate(
                    springBody,
                    [0, 1],
                    [40, 0]
                  )}px)`,
                  opacity: interpolate(springBody, [0, 1], [0, 1]),
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 34,
                    color: '#ff2e93',
                    marginBottom: 10,
                  }}
                >
                  COMUNIDAD
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 26,
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  Atropellar fauna local y manejar en contramano.
                </div>
              </div>

              <div
                style={{
                  padding: '28px 20px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(255, 230, 0, 0.15)',
                  border: '2px solid #ffe600',
                  boxShadow: '0 0 30px rgba(255, 230, 0, 0.3)',
                  transform: `translateY(${interpolate(
                    springPanel,
                    [0, 1],
                    [50, 0]
                  )}px)`,
                  opacity: interpolate(springPanel, [0, 1], [0, 1]),
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 34,
                    color: '#ffe600',
                    marginBottom: 10,
                  }}
                >
                  MISIÓN REAL
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 26,
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  Completar el prólogo... abandonado al min 5.
                </div>
              </div>
            </div>

            <div
              style={{
                alignSelf: 'center',
                padding: '14px 28px',
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.7)',
                border: '2px solid #ffffff',
                fontFamily: FONT_DISPLAY,
                fontSize: 28,
                letterSpacing: 2,
                color: '#ffffff',
              }}
            >
              MEME SCORE: 100/100 🐊
            </div>
          </div>
        );
      }

      case 'data': {
        const barFill1 = interpolate(frame, [15, 60], [0, 96], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const barFill2 = interpolate(frame, [25, 70], [0, 88], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              gap: 20,
            }}
          >
            <div>
              {scene.headline.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 74,
                    lineHeight: 0.96,
                    fontWeight: 900,
                    letterSpacing: -1.5,
                    color: idx === 0 ? scene.accent : '#ffffff',
                    textShadow: `0 0 35px ${scene.accent}70`,
                  }}
                >
                  {line}
                </div>
              ))}
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 30,
                  color: '#cbd5e1',
                  margin: '12px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {scene.sub}
              </p>
            </div>

            {/* Medidores animados HUD */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
                padding: '30px',
                borderRadius: 24,
                backgroundColor: 'rgba(7, 3, 20, 0.85)',
                border: `2px solid ${scene.accent}`,
                boxShadow: `0 0 35px ${scene.accent}30`,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: FONT_BODY,
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  <span>DEFORMACIÓN DE METALES</span>
                  <span style={{ color: scene.accent }}>{Math.round(barFill1)}%</span>
                </div>
                <div
                  style={{
                    height: 14,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${barFill1}%`,
                      backgroundColor: scene.accent,
                      boxShadow: `0 0 16px ${scene.accent}`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: FONT_BODY,
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  <span>DENSIDAD DE AGUA Y OLAS</span>
                  <span style={{ color: '#ff2e93' }}>{Math.round(barFill2)}%</span>
                </div>
                <div
                  style={{
                    height: 14,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${barFill2}%`,
                      backgroundColor: '#ff2e93',
                      boxShadow: '0 0 16px #ff2e93',
                    }}
                  />
                </div>
              </div>
            </div>

            {scene.stat && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  padding: '16px 24px',
                  borderRadius: 18,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderLeft: `8px solid ${scene.accent}`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 60,
                    color: scene.accent,
                    lineHeight: 1,
                  }}
                >
                  {scene.stat.value}
                  {scene.stat.suffix}
                </span>
                <span
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 25,
                    fontWeight: 700,
                    color: '#f8fafc',
                  }}
                >
                  {scene.stat.label}
                </span>
              </div>
            )}
          </div>
        );
      }

      case 'reveal': {
        const headlineLine2 = showGlitchText
          ? '## %$#@&! ##'
          : scene.headline[1];

        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 30,
            }}
          >
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 82,
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: -2,
                textTransform: 'uppercase',
              }}
            >
              <div style={{ color: '#ffffff' }}>{scene.headline[0]}</div>
              <div
                style={{
                  color: scene.accent,
                  textShadow: `0 0 45px ${scene.accent}`,
                  transform: showGlitchText ? 'translateX(10px)' : 'none',
                }}
              >
                {headlineLine2}
              </div>
              <div style={{ color: '#ffffff' }}>{scene.headline[2]}</div>
            </div>

            <div
              style={{
                padding: '30px',
                borderRadius: 22,
                backgroundColor: 'rgba(20, 10, 35, 0.88)',
                border: `3px solid ${scene.accent}`,
                boxShadow: `0 0 40px ${scene.accent}45`,
                opacity: interpolate(springPanel, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(springPanel, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 38,
                  color: scene.accent2,
                  marginBottom: 12,
                }}
              >
                MEMORIA ARTIFICIAL REAL
              </div>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 32,
                  lineHeight: 1.35,
                  color: '#f8fafc',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {scene.sub}
              </p>
            </div>
          </div>
        );
      }

      case 'cta': {
        const commentsCount = Math.floor(
          interpolate(frame, [0, scene.frames], [1200, 8940], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        );

        return (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'center',
              paddingTop: 20,
            }}
          >
            <div
              style={{
                opacity: interpolate(springTitle, [0, 1], [0, 1]),
                transform: `scale(${interpolate(springTitle, [0, 1], [0.9, 1])})`,
              }}
            >
              {scene.headline.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 78,
                    lineHeight: 0.95,
                    fontWeight: 900,
                    letterSpacing: -1.5,
                    textTransform: 'uppercase',
                    color: idx === 0 ? scene.accent : '#ffffff',
                    textShadow: `0 0 40px ${scene.accent}65`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 33,
                lineHeight: 1.35,
                color: '#e2e8f0',
                margin: '0 auto',
                maxWidth: 760,
                fontWeight: 700,
              }}
            >
              {scene.sub}
            </p>

            <div
              style={{
                padding: '28px 34px',
                borderRadius: 24,
                backgroundColor: 'rgba(255, 46, 147, 0.22)',
                border: '3px solid #ff2e93',
                boxShadow: '0 0 35px rgba(255, 46, 147, 0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: interpolate(springPanel, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(springPanel, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 22,
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 800,
                  }}
                >
                  DEBATE EN VIVO
                </div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 36,
                    color: '#ffffff',
                  }}
                >
                  DEJA TU RESPUESTA
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 50,
                  color: '#ffe600',
                  textShadow: '0 0 20px #ffe600',
                }}
              >
                💬 {commentsCount.toLocaleString()}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07030f',
        overflow: 'hidden',
      }}
    >
      {/* CAPA DE CÁMARA VIVA (Drift + Scale + Parallax) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${cameraScale}) translate(${cameraDriftX}px, ${cameraDriftY}px) rotate(${cameraRot}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* CAPA 1: Fondo con degradado profundo dinámico */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 35%, ${scene.accent}24 0%, transparent 65%), linear-gradient(180deg, #07030f 0%, ${scene.accent2}30 50%, #07030f 100%)`,
          }}
        />

        {/* CAPA 2: Sol neón + Rejilla synthwave en perspectiva con scroll infinito + Palmeras SVG */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Sol Neón Segmentado */}
          <div
            style={{
              position: 'absolute',
              top: 500,
              left: '50%',
              width: 440,
              height: 440,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background: `linear-gradient(180deg, ${scene.accent} 0%, #ff7a3d 85%)`,
              boxShadow: `0 0 80px ${scene.accent}90`,
              opacity: 0.8,
            }}
          />

          {/* Rejilla Synthwave Perspectiva */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: -200,
              right: -200,
              height: 900,
              perspective: 450,
              transformOrigin: '50% 100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: 'rotateX(72deg)',
                backgroundImage: `linear-gradient(to right, ${scene.accent}40 2px, transparent 2px), linear-gradient(to bottom, ${scene.accent}40 2px, transparent 2px)`,
                backgroundSize: '90px 90px',
                backgroundPosition: `0px ${gridOffsetY}px`,
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 95%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 95%)',
              }}
            />
          </div>

          {/* Siluetas de Palmeras Neón estilo Miami / Vice */}
          <svg
            viewBox="0 0 1080 1920"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.35,
            }}
          >
            {/* Palmera Izquierda */}
            <path
              d="M -40 1350 Q 80 1150 160 880 Q 90 840 20 890 M 160 880 Q 220 810 320 840 M 160 880 Q 230 920 280 1010 M 160 880 Q 150 780 130 690 M 160 880 Q 90 770 10 790"
              stroke="#07030f"
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
            />
            {/* Palmera Derecha */}
            <path
              d="M 1120 1320 Q 990 1120 900 890 Q 970 850 1050 880 M 900 890 Q 840 820 750 830 M 900 890 Q 850 940 820 1030 M 900 890 Q 930 790 980 720"
              stroke="#07030f"
              strokeWidth="22"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* CAPA 3: Luces ambientales (blobs neón borrosos) + Scanlines + Viñeta */}
        <div
          style={{
            position: 'absolute',
            top: 280 + ambientLightY1,
            left: 120 + ambientLightX1,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: scene.accent,
            filter: 'blur(130px)',
            opacity: 0.22,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 350,
            right: 100 + ambientLightX2,
            width: 550,
            height: 550,
            borderRadius: '50%',
            background: scene.accent2,
            filter: 'blur(140px)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        />

        {/* Scanlines SVG deterministas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.18,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, #000000 4px, #000000 5px)`,
            transform: `translateY(${scanlineShift}px)`,
          }}
        />

        {/* Viñeta cinematográfica */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 50% 50%, transparent 45%, rgba(4, 1, 9, 0.88) 100%)',
          }}
        />

        {/* CAPA 4: Elementos decorativos geométricos HUD */}
        {/* Líneas diagonales de esquina */}
        <div
          style={{
            position: 'absolute',
            top: SAFE.top - 40,
            left: SAFE.left,
            width: 60,
            height: 3,
            backgroundColor: scene.accent,
            boxShadow: `0 0 10px ${scene.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: SAFE.top - 40,
            left: SAFE.left,
            width: 3,
            height: 60,
            backgroundColor: scene.accent,
            boxShadow: `0 0 10px ${scene.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: SAFE.bottom - 40,
            left: SAFE.left,
            width: 50,
            height: 3,
            backgroundColor: scene.accent2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: SAFE.bottom - 40,
            left: SAFE.left,
            width: 3,
            height: 50,
            backgroundColor: scene.accent2,
          }}
        />

        {/* CAPA 5 & 6: ZONA SEGURA DE CONTENIDO + MICRODETALLES */}
        <div
          style={{
            position: 'absolute',
            top: SAFE.top,
            left: SAFE.left,
            width: 1080 - SAFE.left - SAFE.right, // 880px
            height: 1920 - SAFE.top - SAFE.bottom, // 1220px
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10,
            boxSizing: 'border-box',
          }}
        >
          {/* Micro-Header HUD: Tag, Live pulse, Contador de escena y Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              opacity: interpolate(springBase, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(springBase, [0, 1], [-20, 0])}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Badge con pulso determinista */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: badgeToneStyles.bg,
                  border: `2px solid ${badgeToneStyles.border}`,
                  padding: '8px 20px',
                  borderRadius: 999,
                  boxShadow: `0 0 20px ${badgeToneStyles.glow}`,
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: badgeToneStyles.color,
                }}
              >
                {scene.badge.text}
              </div>

              {/* Indicador LIVE parpadeante */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: FONT_BODY,
                  fontSize: 18,
                  fontWeight: 900,
                  color: frame % 30 < 15 ? '#ff2e93' : '#ffffff',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: frame % 30 < 15 ? '#ff2e93' : '#666',
                    boxShadow: frame % 30 < 15 ? '0 0 10px #ff2e93' : 'none',
                  }}
                />
                LIVE
              </div>
            </div>

            {/* Contador de escena + Timestamp */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontFamily: FONT_DISPLAY,
                fontSize: 22,
                letterSpacing: 1.5,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <span>{scene.timestamp}</span>
              <span
                style={{
                  color: scene.accent,
                  fontWeight: 900,
                }}
              >
                0{sceneIndex + 1}/0{totalScenes}
              </span>
            </div>
          </div>

          {/* CUERPO PRINCIPAL DEL LAYOUT SELECCIONADO */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '20px 0',
            }}
          >
            {renderLayoutContent()}
          </div>

          {/* Micro-Footer HUD: Tags de comunidad */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: interpolate(springBase, [0, 1], [0, 1]),
            }}
          >
            {scene.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 20,
                  fontWeight: 800,
                  color: idx === 0 ? scene.accent : 'rgba(255,255,255,0.6)',
                  letterSpacing: 0.5,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSICIÓN: Wipe Diagonal Neón de entrada (Frames 0-10) */}
      {frame < 10 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              backgroundColor: scene.accent,
              transform: `rotate(-25deg) translateY(${interpolate(
                wipeProgress,
                [0, 1],
                [0, -100]
              )}%)`,
              boxShadow: `0 0 100px ${scene.accent}`,
            }}
          />
        </div>
      )}

      {/* TRANSICIÓN: Flash blanco inicial */}
      {flashOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* TRANSICIÓN: Salida Rápida (Últimos 6 frames) */}
      {exitProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#07030f',
            opacity: exitProgress,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
