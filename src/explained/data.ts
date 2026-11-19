export interface Scene {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlightText?: string;
  durationInFrames: number;
  accentColor: string;
}

export const EXPLAINED_SCENES: Scene[] = [
  {
    id: 'hook',
    tag: '¿SABÍAS ESTO?',
    title: 'El 90% de los datos del mundo',
    description: 'se generó únicamente en los últimos dos años.',
    highlightText: 'Explosión de información',
    durationInFrames: 90, // 3 segundos a 30fps
    accentColor: '#38bdf8',
  },
  {
    id: 'key-fact',
    tag: 'EL DATO CLAVE',
    title: 'Cada minuto enviamos millones de mensajes',
    description: 'Redes sociales, sensores y transacciones impulsan un crecimiento exponencial sin precedentes.',
    highlightText: 'Crecimiento Exponencial',
    durationInFrames: 120, // 4 segundos a 30fps
    accentColor: '#f59e0b',
  },
  {
    id: 'conclusion',
    tag: 'CONCLUSIÓN',
    title: 'El valor no está en almacenar',
    description: 'El verdadero reto del futuro es saber interpretar la información correcta.',
    highlightText: 'Aprende a filtrar',
    durationInFrames: 90, // 3 segundos a 30fps
    accentColor: '#10b981',
  },
];
