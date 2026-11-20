// src/theme.ts — Single source of truth for the GTA VI Remotion project.
// Based on remotion-motion-graphics and remotion-best-practices standards.
import { Easing } from 'remotion';

export const theme = {
  colors: {
    bg: '#07030f',
    bgAlt: '#160628',
    bgCard: '#1a0a2a',
    primary: '#ff2e93', // Vice City Neon Magenta (Hero)
    accent: '#00e5ff', // Neon Cyan (Secondary hero)
    warmAccent: '#ff7a3d', // Sunset Orange
    gold: '#ffd166', // Miami Gold
    asphalt: '#090412',
    text: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.65)',
    glowPrimary: 'rgba(255, 46, 147, 0.55)',
    glowAccent: 'rgba(0, 229, 255, 0.55)',
  },
  fonts: {
    display: 'Anton, Impact, "Arial Black", -apple-system, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — Entrances & camera whip stops
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — Camera moves, dolly
    in: Easing.bezier(0.7, 0, 0.84, 0), // Fast exits
    cinematic: Easing.bezier(0.25, 0.1, 0.25, 1), // Hollywood drone / steadycam
  },
  spring: {
    snappy: { damping: 12, stiffness: 200, mass: 0.5 }, // Word pops, caption highlights
    smooth: { damping: 18, stiffness: 100, mass: 0.9 }, // Gate opening, camera zooms
    bouncy: { damping: 10, stiffness: 180, mass: 0.6 }, // Badges & UI stamps
    slam: { damping: 10, stiffness: 220, mass: 0.4 }, // Slam titles
  },
  safeZone: {
    top: 220,
    bottom: 480,
    left: 60,
    right: 140,
    titleY: 290, // Upper third for chapter stamps / slam titles
    captionY: 1300, // Lower third for dynamic subtitles
  },
} as const;
