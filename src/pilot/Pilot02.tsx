import React from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from "remotion";
import {HEIGHT, WIDTH} from "../explained/data";
import {CITY_FAR, FONT, Floor, HORIZON, Line, Skyline, shake} from "./Pilot01";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const ICONS: string[] = [
  "M12 21s-7.5-4.6-9.5-9.2C1.2 8.2 3.4 5 6.6 5c2 0 3.5 1 5.4 3 1.9-2 3.4-3 5.4-3 3.2 0 5.4 3.2 4.1 6.8C19.5 16.4 12 21 12 21z",
  "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm6 3v8l6-4z",
  "M12 2c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z",
  "M13 2L4 14h6l-1 8 9-12h-6z",
];
const COLORS = ["#ff2e93", "#00e5ff", "#ffd34d", "#ffffff"];
const HITS = [0, 44, 92, 140];

const Burst: React.FC<{frame: number}> = ({frame}) => {
  const items: React.ReactElement[] = [];
  for (let i = 0; i < 48; i++) {
    const ang = random(`a${i}`) * Math.PI * 2;
    const spawn = Math.floor(random(`s${i}`) * 30);
    const life = 45 + Math.floor(random(`l${i}`) * 30);
    const rot0 = random(`r${i}`) * 360;
    const c = frame - spawn;
    if (c < 0) continue;
    const p = (c % life) / life;
    const r = Math.pow(p, 1.7) * 1300;
    const x = 540 + Math.cos(ang) * r;
    const y = 900 + Math.sin(ang) * r * 1.3;
    const sc = 0.15 + p * p * 3;
    const op = Math.min(1, p * 6) * (1 - Math.max(0, (p - 0.85) / 0.15));
    const color = COLORS[i % 4];
    items.push(
      <svg
        key={i}
        width={120}
        height={120}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - 60,
          top: y - 60,
          transform: `rotate(${rot0 + frame * 3}deg) scale(${sc})`,
          opacity: op,
          filter: `drop-shadow(0 0 14px ${color})`,
        }}
      >
        <path d={ICONS[i % 4]} fill={color} fillRule="evenodd" />
      </svg>
    );
  }
  return <>{items}</>;
};

export const Pilot02: React.FC = () => {
  const frame = useCurrentFrame();
  const camScale = interpolate(frame, [0, 180], [1, 1.25], {easing: Easing.out(Easing.cubic), ...clamp});
  let shx = 0;
  let shy = 0;
  let flash = 0;
  HITS.forEach((h, k) => {
    shx += shake(frame, h, 16, 2.7 + k * 0.3);
    shy += shake(frame, h, 12, 3.3 + k * 0.2);
    flash += interpolate(frame, [h, h + 1, h + 3], [0, 0.45, 0], clamp);
  });
  const count = Math.floor(interpolate(frame, [0, 150], [0, 999], {easing: Easing.out(Easing.cubic), ...clamp}));
  const rays = interpolate(frame, [0, 20], [0.2, 0.7], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: "#07030f", overflow: "hidden"}}>
      <AbsoluteFill style={{transform: `translate(${shx}px, ${shy}px)`}}>
        <AbsoluteFill style={{transform: `scale(${camScale})`, transformOrigin: "50% 45%"}}>
          <AbsoluteFill style={{background: "linear-gradient(180deg,#0a0020 0%,#2a0845 40%,#8a1b6a 70%,#ff2e93 100%)"}} />
          <div
            style={{
              position: "absolute",
              left: -660,
              top: -300,
              width: 2400,
              height: 2400,
              opacity: rays,
              transform: `rotate(${-frame * 0.8}deg)`,
              background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(0,229,255,0.28) 0deg 5deg, transparent 5deg 15deg)",
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 45%)",
              maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 45%)",
            }}
          />
          <Skyline city={CITY_FAR} fill="#1a0535" glow="#ff2e93" scroll={-frame * 0.4} baseY={HORIZON} />
          <Floor frame={frame} />
          <Burst frame={frame} />
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 0,
            width: WIDTH,
            top: 1130,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 200,
            lineHeight: 1,
            color: "#00e5ff",
            opacity: 0.85,
            textShadow: "0 0 40px #00e5ff",
          }}
        >
          {`+${count}`}
        </div>

        <Line text="MINUTOS" start={-4} end={44} size={250} y={540} fill="#ffffff" stagger={2} />
        <Line text="CLIPS" start={44} end={92} size={330} y={520} fill="#ffd34d" stagger={2} />
        <Line text="POR TODOS LADOS" start={92} end={138} size={130} y={600} fill="#ffffff" stagger={1} />
        <Line text="TU FEED" start={140} end={200} size={260} y={520} fill="#ffffff" stagger={2} />
      </AbsoluteFill>

      <AbsoluteFill style={{background: "#ffffff", opacity: Math.min(0.5, flash), pointerEvents: "none"}} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <svg width={WIDTH} height={HEIGHT} style={{position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none"}}>
        <filter id="grain2">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain2)" />
      </svg>
    </AbsoluteFill>
  );
};
