export interface SafeZone {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Scene {
  id: string;
  frames: number;
  accent: string;
  accent2: string;
  headline: string[];
  tags: string[];
}

export interface SfxCue {
  frame: number;
  file: string;
  volume: number;
}

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SAFE: SafeZone = {
  top: 220,
  bottom: 480,
  left: 60,
  right: 140,
};

export const VO_DELAY: Record<number, number> = {
  1: 6,
  2: 6,
  3: 6,
  4: 6,
  5: 40,
  6: 8,
};

export const SCENES: Scene[] = [
  {
    id: 's01-gancho',
    frames: 120,
    accent: '#ff2e93',
    accent2: '#00e5ff',
    headline: ['HORA 0', 'LOCO'],
    tags: ['#HORA0', '#VIRAL'],
  },
  {
    id: 's02-caos',
    frames: 180,
    accent: '#00e5ff',
    accent2: '#ff2e93',
    headline: ['CAOS TOTAL', '999+'],
    tags: ['#FEED', '#SPAM'],
  },
  {
    id: 's03-locuras',
    frames: 190,
    accent: '#ff7a3d',
    accent2: '#ff2e93',
    headline: ['DESMADRE'],
    tags: ['#AUTOSVOLANDO', '#POLICIA'],
  },
  {
    id: 's04-fisicas',
    frames: 180,
    accent: '#00e5ff',
    accent2: '#2a0845',
    headline: ['FÍSICAS'],
    tags: ['#DETALLES', '#SLOWMO'],
  },
  {
    id: 's05-giro',
    frames: 190,
    accent: '#ff2e93',
    accent2: '#00e5ff',
    headline: ['¿QUÉ?!', 'NADIE LO VIO VENIR'],
    tags: ['#PLOTWIST', '#MISTERIO'],
  },
  {
    id: 's06-cierre',
    frames: 160,
    accent: '#ff7a3d',
    accent2: '#00e5ff',
    headline: ['¿QUÉ HICISTE', 'PRIMERO?'],
    tags: ['#FINAL', '#COMENTA'],
  },
];

export const TOTAL_FRAMES: number = SCENES.reduce(
  (accum, scene) => accum + scene.frames,
  0
);

export const SCENE_STARTS: number[] = SCENES.reduce<number[]>(
  (starts, scene, index) => {
    if (index === 0) {
      return [0];
    }
    const prevStart = starts[index - 1];
    const prevFrames = SCENES[index - 1].frames;
    starts.push(prevStart + prevFrames);
    return starts;
  },
  []
);

if (TOTAL_FRAMES !== 1020) {
  throw new Error(
    `Error de sincronización en data.ts: TOTAL_FRAMES debe ser exactamente 1020, pero se calcularon ${TOTAL_FRAMES}. Revisa los frames de cada escena.`
  );
}

// SFX CUES:
// - Whoosh / Hit / Glitch 3 frames antes de cada corte entre escenas
// - Hits en palabras gigantes
// - Riser antes del giro en escena 5
// Inicios de escena: [0, 120, 300, 490, 670, 860]
export const SFX_CUES: SfxCue[] = [
  // Frame 0: Hit + Sting inicial de HORA 0
  { frame: 0, file: 'audio/sfx/hit.wav', volume: 0.9 },
  { frame: 0, file: 'audio/sfx/sting.wav', volume: 0.75 },
  // Escena 1 (0..120)
  { frame: 14, file: 'audio/sfx/whoosh.wav', volume: 0.65 },
  { frame: 90, file: 'audio/sfx/hit.wav', volume: 0.8 },
  { frame: 92, file: 'audio/sfx/glitch.wav', volume: 0.6 },
  // Corte a Escena 2 (f120) -> 3 frames antes = 117
  { frame: 117, file: 'audio/sfx/whoosh.wav', volume: 0.7 },

  // Escena 2 (120..300)
  { frame: 180, file: 'audio/sfx/pop.wav', volume: 0.6 },
  { frame: 240, file: 'audio/sfx/whoosh.wav', volume: 0.65 },
  // Corte a Escena 3 (f300) -> 3 frames antes = 297
  { frame: 297, file: 'audio/sfx/glitch.wav', volume: 0.7 },

  // Escena 3 (300..490)
  { frame: 345, file: 'audio/sfx/whoosh.wav', volume: 0.6 },
  { frame: 395, file: 'audio/sfx/whoosh.wav', volume: 0.65 },
  { frame: 445, file: 'audio/sfx/hit.wav', volume: 0.85 }, // DESMADRE
  // Corte a Escena 4 (f490) -> 3 frames antes = 487
  { frame: 487, file: 'audio/sfx/whoosh.wav', volume: 0.7 },

  // Escena 4 (490..670)
  { frame: 490, file: 'audio/sfx/hit.wav', volume: 0.85 }, // Choque barrera
  { frame: 610, file: 'audio/sfx/hit.wav', volume: 0.8 }, // FÍSICAS
  { frame: 650, file: 'audio/sfx/whoosh.wav', volume: 0.6 },
  // Corte a Escena 5 (f670) -> 3 frames antes = 667
  { frame: 667, file: 'audio/sfx/glitch.wav', volume: 0.75 },

  // Escena 5 (670..860): f0-8 silencio total (670-678)
  { frame: 678, file: 'audio/sfx/riser.wav', volume: 0.85 }, // Riser antes del giro
  { frame: 720, file: 'audio/sfx/glitch.wav', volume: 0.8 },
  { frame: 740, file: 'audio/sfx/hit.wav', volume: 0.9 }, // ¿QUÉ?!
  // Corte a Escena 6 (f860) -> 3 frames antes = 857
  { frame: 857, file: 'audio/sfx/whoosh.wav', volume: 0.7 },

  // Escena 6 (860..1020)
  { frame: 920, file: 'audio/sfx/hit.wav', volume: 0.8 }, // ¿QUÉ HICISTE PRIMERO?
  { frame: 980, file: 'audio/sfx/whoosh.wav', volume: 0.6 },
];
