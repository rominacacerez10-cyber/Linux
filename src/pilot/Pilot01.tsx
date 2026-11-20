import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {loadFont} from "@remotion/google-fonts/Anton";
import {HEIGHT, SAFE, WIDTH} from "../explained/data";

export const FONT = loadFont().fontFamily;
export const HORIZON = 1060;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

type Building = {x: number; w: number; h: number; step: number; lit: number};

const makeCity = (seed: string, minH: number, maxH: number): Building[] => {
  const out: Building[] = [];
  let x = -40;
  for (let i = 0; i < 40; i++) {
    const w = 60 + random(`${seed}w${i}`) * 70;
    const h = minH + random(`${seed}h${i}`) * (maxH - minH);
    out.push({x, w, h, step: 0.55 + random(`${seed}s${i}`) * 0.25, lit: random(`${seed}l${i}`)});
    x += w + 6 + random(`${seed}g${i}`) * 10;
    if (x > WIDTH + 120) break;
  }
  return out;
};
export const CITY_FAR = makeCity("far", 220, 520);
const CITY_NEAR = makeCity("near", 140, 360);

export const shake = (f: number, at: number, amp: number, freq: number): number =>
  f < at ? 0 : Math.sin((f - at) * freq) * amp * Math.exp(-(f - at) / 6);

export const Skyline: React.FC<{
  city: Building[];
  fill: string;
  glow: string;
  scroll: number;
  baseY: number;
}> = ({city, fill, glow, scroll, baseY}) => (
  <svg
    width={WIDTH}
    height={420}
    viewBox={`0 0 ${WIDTH} 420`}
    style={{position: "absolute", left: 0, top: baseY - 420}}
  >
    <g transform={`translate(${scroll},0)`}>
      {city.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={420 - b.h} width={b.w} height={b.h} fill={fill} />
          <rect
            x={b.x + (b.w * (1 - b.step)) / 2}
            y={420 - b.h - 40}
            width={b.w * b.step}
            height={40}
            fill={fill}
          />
          <rect x={b.x} y={420 - b.h} width={b.w} height={3} fill={glow} opacity={0.9} />
          {b.lit > 0.45 && (
            <rect
              x={b.x + b.w * 0.3}
              y={420 - b.h * 0.7}
              width={6}
              height={b.h * 0.5}
              fill={glow}
              opacity={0.35}
            />
          )}
        </g>
      ))}
    </g>
  </svg>
);

const Sun: React.FC<{frame: number}> = ({frame}) => {
  const cy = interpolate(frame, [0, 120], [HORIZON - 120, HORIZON - 300], clamp);
  const stripes: React.ReactElement[] = [];
  for (let k = 0; k < 8; k++) {
    stripes.push(
      <rect key={k} x={0} y={cy + 20 + k * 44} width={WIDTH} height={4 + k * 3} fill="black" />
    );
  }
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <linearGradient id="sunG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd34d" />
          <stop offset="0.5" stopColor="#ff7a3d" />
          <stop offset="1" stopColor="#ff2e93" />
        </linearGradient>
        <mask id="sunM">
          <rect width={WIDTH} height={HEIGHT} fill="white" />
          {stripes}
        </mask>
      </defs>
      <circle cx={540} cy={cy} r={340} fill="url(#sunG)" mask="url(#sunM)" />
    </svg>
  );
};

export const Floor: React.FC<{frame: number}> = ({frame}) => {
  const lines: React.ReactElement[] = [];
  const N = 16;
  const scroll = (frame * 0.045) % 1;
  for (let i = 0; i < N; i++) {
    const t = (i + scroll) / N;
    const y = HORIZON + (HEIGHT - HORIZON) * Math.pow(t, 2.3);
    lines.push(
      <line key={`h${i}`} x1={0} x2={WIDTH} y1={y} y2={y} stroke="#00e5ff" strokeWidth={2 + t * 4} opacity={0.35 + t * 0.5} />
    );
  }
  for (let k = -14; k <= 14; k++) {
    lines.push(
      <line key={`v${k}`} x1={540 + k * 45} y1={HORIZON} x2={540 + k * 380} y2={HEIGHT} stroke="#ff2e93" strokeWidth={3} opacity={0.5} />
    );
  }
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0845" />
          <stop offset="1" stopColor="#07030f" />
        </linearGradient>
      </defs>
      <rect x={0} y={HORIZON} width={WIDTH} height={HEIGHT - HORIZON} fill="url(#floorG)" />
      {lines}
    </svg>
  );
};

const FROND: Array<[number, number]> = [
  [-190, 40], [-150, -40], [-80, -90], [0, -110], [80, -90], [150, -40], [190, 40],
];

const Palm: React.FC<{x: number; y: number; s: number; flip: boolean; frame: number; seed: number}> = ({
  x, y, s, flip, frame, seed,
}) => {
  const sway = Math.sin(frame / 18 + seed) * 3;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${sway})`}>
        <path d="M0 0 C 20 -200 -10 -380 30 -560" stroke="#08000f" strokeWidth={36} fill="none" strokeLinecap="round" />
        {FROND.map(([dx, dy], i) => (
          <path
            key={i}
            d={`M30 -560 Q ${30 + dx * 0.5} ${-560 + dy - 90} ${30 + dx} ${-560 + dy}`}
            stroke="#08000f"
            strokeWidth={26}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
};

const Gate: React.FC<{side: "l" | "r"; p: number}> = ({side, p}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: side === "l" ? 0 : 540,
      width: 540,
      height: HEIGHT,
      transform: `translateX(${(side === "l" ? -540 : 540) * p}px)`,
      background:
        "repeating-linear-gradient(90deg, rgba(255,46,147,0) 0px 62px, rgba(255,46,147,0.7) 62px 68px), linear-gradient(180deg,#0c0220,#2a0845 50%,#0c0220)",
    }}
  >
    <div style={{position: "absolute", top: 700, left: 0, width: 540, height: 10, background: "#00e5ff", boxShadow: "0 0 30px #00e5ff"}} />
    <div style={{position: "absolute", top: 1500, left: 0, width: 540, height: 10, background: "#00e5ff", boxShadow: "0 0 30px #00e5ff"}} />
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side === "l" ? "right" : "left"]: 0,
        width: 10,
        background: "#00e5ff",
        boxShadow: "0 0 40px 10px #00e5ff",
      }}
    />
  </div>
);

export const Line: React.FC<{
  text: string;
  start: number;
  end: number;
  size: number;
  y: number;
  fill: string;
  stagger?: number;
}> = ({text, start, end, size, y, fill, stagger = 2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame > end) return null;
  const out = interpolate(frame, [end - 8, end], [0, 1], clamp);
  const ab = 3 + 16 * Math.exp(-Math.max(0, frame - start) / 8);
  const letters = Array.from(text);
  const layer = (color: string, dx: number, blend: boolean, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: SAFE.left,
        width: WIDTH - SAFE.left - SAFE.right,
        top: y,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        transform: `translate(${dx}px, ${-out * 150}px)`,
        opacity: 1 - out,
        mixBlendMode: blend ? "screen" : "normal",
      }}
    >
      {letters.map((ch, i) => {
        const sp = spring({
          frame: frame - start - i * stagger,
          fps,
          config: {damping: 11, stiffness: 170, mass: 0.6},
        });
        const sc = interpolate(sp, [0, 1], [1.6, 1]);
        const ty = interpolate(sp, [0, 1], [-120, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${ty}px) scale(${sc})`,
              opacity: Math.min(1, sp * 3),
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </div>
  );
  return (
    <>
      {layer("#00e5ff", -ab, true, "c")}
      {layer("#ff2e93", ab, true, "m")}
      {layer(fill, 0, false, "w")}
    </>
  );
};

export const Pilot01: React.FC = () => {
  const frame = useCurrentFrame();

  const camScale = interpolate(frame, [0, 120], [1, 1.3], {
    easing: Easing.out(Easing.cubic),
    ...clamp,
  });
  const shx = shake(frame, 0, 18, 2.7) + shake(frame, 14, 12, 3.1) + shake(frame, 90, 26, 2.9);
  const shy = shake(frame, 0, 14, 3.3) + shake(frame, 14, 10, 2.5) + shake(frame, 90, 22, 3.7);

  const gateP = interpolate(frame, [14, 50], [0, 1], {easing: Easing.inOut(Easing.cubic), ...clamp});
  const flash =
    interpolate(frame, [14, 15, 17], [0, 0.55, 0], clamp) +
    interpolate(frame, [90, 91, 93], [0, 0.5, 0], clamp);
  const bloom = interpolate(frame, [14, 30, 56], [0, 0.6, 0], clamp);
  const rays = interpolate(frame, [90, 96], [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: "#07030f", overflow: "hidden"}}>
      <AbsoluteFill style={{transform: `translate(${shx}px, ${shy}px)`}}>
        <AbsoluteFill
          style={{
            transform: `scale(${camScale})`,
            transformOrigin: `50% ${(HORIZON / HEIGHT) * 100}%`,
          }}
        >
          <AbsoluteFill
            style={{background: "linear-gradient(180deg,#12002b 0%,#3b0a5e 35%,#b0206f 62%,#ff7a3d 78%)"}}
          />
          <Sun frame={frame} />
          <Skyline city={CITY_FAR} fill="#3a0d52" glow="#ff2e93" scroll={-frame * 0.3} baseY={HORIZON} />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: WIDTH,
              top: HORIZON - 170,
              height: 220,
              background: "linear-gradient(180deg,transparent,rgba(255,46,147,0.5),transparent)",
            }}
          />
          <Skyline city={CITY_NEAR} fill="#16042b" glow="#00e5ff" scroll={-frame * 0.6} baseY={HORIZON + 20} />
          <Floor frame={frame} />
          <Palm x={110} y={1330} s={1} flip={false} frame={frame} seed={0} />
          <Palm x={990} y={1370} s={1.1} flip={true} frame={frame} seed={2} />
        </AbsoluteFill>

        <Gate side="l" p={gateP} />
        <Gate side="r" p={gateP} />

        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.9), rgba(255,122,61,0.4) 35%, transparent 65%)",
            opacity: bloom,
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: -660,
            top: -500,
            width: 2400,
            height: 2400,
            opacity: rays * 0.8,
            transform: `rotate(${frame * 0.5}deg)`,
            background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,46,147,0.35) 0deg 6deg, transparent 6deg 18deg)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 35%)",
            maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 35%)",
          }}
        />

        <Line text="HORA 0" start={-40} end={52} size={330} y={520} fill="#ffffff" stagger={2} />
        <Line text="BIENVENIDO A" start={46} end={88} size={120} y={500} fill="#ffffff" stagger={1} />
        <Line text="VICE CITY" start={50} end={88} size={240} y={640} fill="#ffd34d" stagger={2} />
        <Line text="LOCO" start={90} end={130} size={400} y={600} fill="#ffffff" stagger={2} />
      </AbsoluteFill>

      <AbsoluteFill style={{background: "#ffffff", opacity: Math.min(0.55, flash), pointerEvents: "none"}} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none"}}
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
