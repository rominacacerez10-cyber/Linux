import { Easing } from 'remotion';
import { loadFont as loadBangers } from '@remotion/google-fonts/Bangers';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';

const bangers = loadBangers();
const anton = loadAnton();

export const COMIC_FONT = `${bangers.fontFamily}, Impact, "Arial Black", sans-serif`;
export const IMPACT_FONT = `${anton.fontFamily}, Impact, "Arial Black", sans-serif`;
export const BODY_FONT = 'Inter, -apple-system, "Segoe UI", sans-serif';

export const INK = '#111111';
export const PAPER = '#fff4e2';
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const theme = {
  colors: {
    ink: INK,
    paper: PAPER,
    night: '#07020f',
    nightAlt: '#13051f',
    magenta: '#ff2e93',
    cyan: '#00e5ff',
    orange: '#ff7a3d',
    gold: '#ffd166',
    mint: '#00ffb2',
    red: '#ff3b30',
  },
  fonts: {
    comic: COMIC_FONT,
    impact: IMPACT_FONT,
    body: BODY_FONT,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    cinematic: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  spring: {
    snappy: { damping: 12, stiffness: 210, mass: 0.48 },
    smooth: { damping: 18, stiffness: 100, mass: 0.9 },
    bouncy: { damping: 10, stiffness: 180, mass: 0.6 },
    slam: { damping: 9, stiffness: 230, mass: 0.42 },
  },
  layout: {
    headerTop: 26,
    headerHeight: 128,
    tickerTop: 158,
    panelTop: 214,
    panelLeft: 38,
    panelWidth: 1004,
    panelHeight: 1148,
    captionTop: 1396,
    footerTop: 1620,
    safeSide: 44,
  },
} as const;
