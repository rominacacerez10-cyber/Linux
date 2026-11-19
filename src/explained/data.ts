export type Layout = 'impact' | 'feed' | 'contrast' | 'data' | 'reveal' | 'cta';

export type BadgeTone = 'alert' | 'hot' | 'meme' | 'info';

export interface SceneBadge {
  text: string;
  tone: BadgeTone;
}

export interface SceneStat {
  value: number;
  suffix: string;
  label: string;
}

export interface Scene {
  id: string;
  frames: number;
  layout: Layout;
  accent: string;
  accent2: string;
  badge: SceneBadge;
  headline: string[];
  sub: string;
  stat?: SceneStat;
  tags: string[];
  timestamp: string;
}

export interface SafeZone {
  top: number;
  bottom: number;
  left: number;
  right: number;
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

export const SCENES: Scene[] = [
  {
    id: 'scene-01-impact',
    frames: 150,
    layout: 'impact',
    accent: '#ff2e93',
    accent2: '#ff7a3d',
    badge: { text: 'ALERTA ROJA', tone: 'alert' },
    headline: ['ABRIERON', 'LAS PUERTAS', 'DE VICE CITY'],
    sub: 'Servidores colapsados y streamers gritando en vivo.',
    stat: { value: 12, suffix: 'M+', label: 'intentos en simultáneo' },
    tags: ['#GTAVI', '#ViceCity', '#Lanzamiento'],
    timestamp: 'T+00:00:14',
  },
  {
    id: 'scene-02-feed',
    frames: 180,
    layout: 'feed',
    accent: '#00e5ff',
    accent2: '#ff2e93',
    badge: { text: 'TENDENCIA', tone: 'hot' },
    headline: ['EL FEED', 'EXPLOTÓ POR', 'COMPLETO'],
    sub: 'Cero horas de sueño y spoilers en cada esquina.',
    stat: { value: 40, suffix: 'M', label: 'clips compartidos' },
    tags: ['#Spoilers', '#ViceClips', '#SinDormir'],
    timestamp: 'T+00:42:08',
  },
  {
    id: 'scene-03-contrast',
    frames: 180,
    layout: 'contrast',
    accent: '#ff7a3d',
    accent2: '#ffe600',
    badge: { text: 'MODO CAOS', tone: 'meme' },
    headline: ['COMUNIDAD VS', 'LEYES DE LA', 'CALLE REAL'],
    sub: 'Nadie tocó la historia: todos a cazar cocodrilos.',
    tags: ['#ViceBeach', '#ModoCaos', '#LeyesCero'],
    timestamp: 'T+01:15:32',
  },
  {
    id: 'scene-04-data',
    frames: 180,
    layout: 'data',
    accent: '#00e5ff',
    accent2: '#2a0845',
    badge: { text: 'FÍSICAS TOP', tone: 'info' },
    headline: ['DETALLES QUE', 'TE ROMPEN', 'LA CABEZA'],
    sub: 'Físicas hiperrealistas en cada centímetro de chapa.',
    stat: { value: 60, suffix: ' FPS', label: 'fidelidad visual extrema' },
    tags: ['#NextGen', '#Graficazos', '#Fisicas'],
    timestamp: 'T+01:58:19',
  },
  {
    id: 'scene-05-reveal',
    frames: 170,
    layout: 'reveal',
    accent: '#ff2e93',
    accent2: '#00e5ff',
    badge: { text: 'GIRO TOTAL', tone: 'hot' },
    headline: ['LOS NPCS YA', 'NO PERDONAN', 'NADA AMIGO'],
    sub: 'Si la lías en una esquina te recuerdan y te buscan.',
    tags: ['#NPCsVivos', '#PlotTwist', '#ViceCityIA'],
    timestamp: 'T+02:33:04',
  },
  {
    id: 'scene-06-cta',
    frames: 160,
    layout: 'cta',
    accent: '#ffe600',
    accent2: '#ff2e93',
    badge: { text: 'TU TURNO', tone: 'hot' },
    headline: ['¿CONSOLA HOY', 'O ESPERAS', 'A LA PC?'],
    sub: 'Comenta tu bando abajo antes de que te spoileen todo.',
    stat: { value: 89, suffix: 'K', label: 'debates encendidos' },
    tags: ['#GamerLatino', '#Debate', '#ViceVeredicto'],
    timestamp: 'T+03:00:00',
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
