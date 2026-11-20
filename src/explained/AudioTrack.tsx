import React from 'react';
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SCENES, SCENE_STARTS, SFX_CUES, TOTAL_FRAMES, VO_DELAY } from './data';
import { VO_TIMINGS } from './timings';

export const AudioTrack: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Calcular si alguna voz está activa en el frame actual para ducking de la música
  const isVoiceActive = (frame: number): boolean => {
    return VO_TIMINGS.some((timing) => {
      const sceneIndex = timing.scene - 1;
      const sceneStart = SCENE_STARTS[sceneIndex];
      const voStart = sceneStart + (VO_DELAY[timing.scene] ?? 0);
      const voDurationFrames = Math.round(timing.durationSec * 30);
      const voEnd = voStart + voDurationFrames;
      return frame >= voStart && frame < voEnd;
    });
  };

  // Suavizado del ducking: buscamos la proximidad a la voz para rampa de 6 frames
  const getDuckingLevel = (frame: number): number => {
    // Si la voz está sonando: volumen a 0.10
    if (isVoiceActive(frame)) {
      return 0.1;
    }

    // Comprobar transición de entrada (6 frames antes de que empiece la voz)
    for (const timing of VO_TIMINGS) {
      const sceneIndex = timing.scene - 1;
      const sceneStart = SCENE_STARTS[sceneIndex];
      const voStart = sceneStart + (VO_DELAY[timing.scene] ?? 0);
      const voDurationFrames = Math.round(timing.durationSec * 30);
      const voEnd = voStart + voDurationFrames;

      if (frame >= voStart - 6 && frame < voStart) {
        return interpolate(frame, [voStart - 6, voStart], [0.22, 0.1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
      if (frame >= voEnd && frame < voEnd + 6) {
        return interpolate(frame, [voEnd, voEnd + 6], [0.1, 0.22], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
    }

    return 0.22;
  };

  // Fade out de la música en los últimos 20 frames
  const fadeOutMultiplier = interpolate(
    currentFrame,
    [TOTAL_FRAMES - 20, TOTAL_FRAMES],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Escena 5 f0-8 silencio total (frame 670 a 678)
  const silenceMultiplier =
    currentFrame >= 670 && currentFrame < 678 ? 0 : 1;

  const musicVolume =
    getDuckingLevel(currentFrame) * fadeOutMultiplier * silenceMultiplier;

  return (
    <>
      {/* Música Synthwave sintetizada de fondo */}
      <Audio
        src={staticFile('audio/music.wav')}
        volume={() => musicVolume}
      />

      {/* Pistas de Voz por escena con retraso VO_DELAY */}
      {SCENES.map((scene, index) => {
        const sceneNum = index + 1;
        const delay = VO_DELAY[sceneNum] ?? 0;
        const globalStart = SCENE_STARTS[index] + delay;
        const voFile = `audio/vo/s0${sceneNum}.mp3`;

        return (
          <Sequence
            key={`vo-scene-${sceneNum}`}
            from={globalStart}
            durationInFrames={scene.frames - delay}
          >
            <Audio src={staticFile(voFile)} volume={1.0} />
          </Sequence>
        );
      })}

      {/* Efectos de sonido (SFX_CUES) */}
      {SFX_CUES.map((cue, idx) => (
        <Sequence
          key={`sfx-${idx}-${cue.file}-${cue.frame}`}
          from={cue.frame}
          durationInFrames={45}
        >
          <Audio src={staticFile(cue.file)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
