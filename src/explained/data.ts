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
    tag: 'HORA CERO 🔥',
    title: 'SE CAYÓ MEDIO INTERNET',
    description: 'Minuto 1 del lanzamiento: servidores de descarga colapsados y streamers gritando en vivo.',
    stat: '12M+',
    statLabel: 'personas intentando entrar al mismo segundo',
    highlightText: '12 años esperando este momento exacto',
    durationInFrames: 165, // 5.5 seg
    accentColor: '#ff2a85',
  },
  {
    id: 'chaos-networks',
    stepNumber: '02',
    tag: 'EL COLAPSO TOTAL 🌐',
    title: 'TIKTOK Y TWITTER SON PURO SPOILER',
    description: 'Nadie durmió. Cero trabajo al día siguiente. 40 millones de clips subidos en 2 horas.',
    stat: '#1',
    statLabel: 'tendencia global en todas las redes sociales',
    highlightText: 'Tu feed está 100% secuestrado por Vice City',
    durationInFrames: 170, // ~5.66 seg
    accentColor: '#00f0ff',
  },
  {
    id: 'first-chaos',
    stepNumber: '03',
    tag: 'LA COMUNIDAD EN ACCIÓN 🐊',
    title: 'LO PRIMERO QUE HIZO LA GENTE...',
    description: 'Olvídate de la misión principal: todos fueron directo a robar tanques y atropellar cocodrilos.',
    stat: '0%',
    statLabel: 'de respeto a las leyes de tránsito',
    highlightText: 'El caos en Vice Beach empezó al minuto 3',
    durationInFrames: 175, // ~5.83 seg
    accentColor: '#ffe600',
  },
  {
    id: 'physics-details',
    stepNumber: '04',
    tag: 'FÍSICAS DEMENCIALES 🚗',
    title: 'DETALLES QUE TE DEJAN LOCO',
    description: 'El agua se mueve real, la ropa se moja por capas y cada choque deforma la chapa al milímetro.',
    stat: '4K/60',
    statLabel: 'gráficos que parecen una película callejera',
    highlightText: 'Rockstar redefinió lo que puede hacer una consola',
    durationInFrames: 175, // ~5.83 seg
    accentColor: '#10b981',
  },
  {
    id: 'unexpected',
    stepNumber: '05',
    tag: 'NADIE LO VENÍA VENIR 🤯',
    title: 'LOS NPCS AHORA TIENEN MEMORIA',
    description: 'Si le pegas a alguien en una esquina, te reconoce horas después y llama a la policía con su móvil.',
    stat: 'IA TOP',
    statLabel: 'reacciones únicas para cada habitante',
    highlightText: 'El juego se siente vivo como nunca antes',
    durationInFrames: 170, // ~5.66 seg
    accentColor: '#a855f7',
  },
  {
    id: 'closing-hype',
    stepNumber: '06',
    tag: 'EL VEREDICTO FINAL 👑',
    title: '¿VALIÓ LA PENA LA ESPERA?',
    description: 'El mayor evento en la historia de los videojuegos ya está aquí. Guarda esto y no te comas spoilers.',
    highlightText: 'Vice City te está esperando',
    callToAction: '¿PS5, Xbox o esperas a PC? ¡Comenta abajo! 👇🎮',
    durationInFrames: 165, // 5.5 seg
    accentColor: '#ff0055',
  },
];

export const TOTAL_DURATION_IN_FRAMES = EXPLAINED_SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0
);
