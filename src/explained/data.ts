export interface Scene {
  id: string;
  tag: string;
  stepNumber: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  highlightText?: string;
  callToAction?: string;
  durationInFrames: number;
  accentColor: string;
}

export const EXPLAINED_SCENES: Scene[] = [
  {
    id: 'hook',
    stepNumber: '01',
    tag: '¿TE HAS DADO CUENTA?',
    title: 'Pierdes hasta 3 horas al día sin saberlo',
    description: 'La mayoría de las personas revisa su teléfono más de 120 veces al día en micropausas automáticas.',
    stat: '120+',
    statLabel: 'veces al día desbloqueas la pantalla',
    highlightText: 'El 80% ocurre de forma inconsciente',
    durationInFrames: 90, // 3 segundos @ 30fps
    accentColor: '#f43f5e',
  },
  {
    id: 'key-point-1',
    stepNumber: '02',
    tag: 'EL MOTIVO REAL',
    title: 'Tu cerebro busca micro-dosis de dopamina',
    description: 'Cada notificación y scroll infinito simula una recompensa variable diseñada por algoritmos.',
    stat: '93%',
    statLabel: 'de las apps usan bucles de refuerzo variable',
    highlightText: 'No es falta de voluntad, es diseño conductual',
    durationInFrames: 105, // 3.5 segundos @ 30fps
    accentColor: '#38bdf8',
  },
  {
    id: 'key-point-2',
    stepNumber: '03',
    tag: 'EL MÉTODO PROBADO',
    title: 'Aplica la regla de los 20 segundos',
    description: 'Añade una pequeña fricción física a tus distracciones: escala de grises o el celular en otra habitación.',
    stat: '+40%',
    statLabel: 'de concentración recuperada en la primera semana',
    highlightText: 'Fricción estratégica = Libertad mental',
    durationInFrames: 115, // ~3.8 segundos @ 30fps
    accentColor: '#10b981',
  },
  {
    id: 'conclusion-cta',
    stepNumber: '04',
    tag: 'EMPIEZA HOY',
    title: 'Recupera el control de tu atención',
    description: 'No necesitas dejar la tecnología, solo aprender a dominar las barreras de entrada.',
    highlightText: 'Guarda este video para implementarlo hoy',
    callToAction: '¿Cuántas horas de pantalla tienes hoy? Comenta abajo 👇',
    durationInFrames: 110, // ~3.7 segundos @ 30fps
    accentColor: '#a855f7',
  },
];

export const TOTAL_DURATION_IN_FRAMES = EXPLAINED_SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0
);
