import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   NYX — the archive's resident snow leopard.
   Pixel art is generated on a 32x30 grid so every shape stays
   symmetric; only the face (eyes/mouth) swaps between frames.
   ============================================================ */

type Px = [number, number, number, number]; // x, y, w, h

const W = 32;

/** Mirror a pixel run across the vertical centre line. */
const mirror = ([x, y, w, h]: Px): Px => [W - x - w, y, w, h];
/** A left-side run plus its mirrored twin. */
const pair = (p: Px): Px[] => [p, mirror(p)];
const pairAll = (ps: Px[]): Px[] => ps.flatMap(pair);

/** Outline of a pixel rounded-rect, with 45° corner staircases. */
function rrOutline(x: number, y: number, w: number, h: number, r: number): Px[] {
  const out: Px[] = [
    [x + r, y, w - 2 * r, 1],
    [x + r, y + h - 1, w - 2 * r, 1],
    [x, y + r, 1, h - 2 * r],
    [x + w - 1, y + r, 1, h - 2 * r],
  ];
  for (let i = 0; i < r; i++) {
    const dx = r - 1 - i;
    out.push([x + dx, y + i, 1, 1]);
    out.push([x + w - 1 - dx, y + i, 1, 1]);
    out.push([x + dx, y + h - 1 - i, 1, 1]);
    out.push([x + w - 1 - dx, y + h - 1 - i, 1, 1]);
  }
  return out;
}

/* ---------- static chrome ---------- */

const HEAD = rrOutline(2, 7, 28, 17, 4);
const SCREEN = rrOutline(7, 11, 18, 11, 3);
const COLLAR = rrOutline(12, 24, 8, 5, 1);

// Ear outline: apex at the top, slopes down to the skull line.
const EAR_OUTLINE = pairAll([
  [5, 1, 3, 1],
  [4, 2, 1, 2],
  [3, 4, 1, 4],
  [8, 2, 1, 2],
  [9, 4, 1, 2],
  [10, 6, 1, 2],
]);

// Solid inner ear — a slim triangle, not a blob.
const EAR_FILL = pairAll([
  [6, 3, 1, 1],
  [5, 4, 3, 1],
  [5, 5, 3, 1],
  [5, 6, 4, 1],
]);

// Rosettes scattered over the pelt.
const SPOTS = [
  ...pairAll([
    [11, 8, 2, 1],
    [9, 10, 1, 1],
    [12, 10, 1, 1],
    [4, 12, 2, 1],
    [5, 14, 1, 1],
    [3, 16, 1, 1],
    [4, 18, 2, 1],
    [5, 21, 1, 1],
    [11, 22, 1, 1],
  ]),
  [15, 8, 2, 1] as Px,
  [14, 10, 1, 1] as Px,
  [17, 10, 1, 1] as Px,
];

const WHISKERS = pairAll([
  [4, 16, 3, 1],
  [4, 19, 3, 1],
]);

// `</>` badge on the collar.
const COLLAR_GLYPH: Px[] = [
  [14, 25, 1, 1], [13, 26, 1, 1], [14, 27, 1, 1],
  [16, 25, 1, 1], [16, 26, 1, 1], [15, 27, 1, 1],
  [17, 25, 1, 1], [18, 26, 1, 1], [17, 27, 1, 1],
];

/* ---------- face parts ---------- */

type EyeKind =
  | "open" | "blink" | "arc" | "wide" | "sleepy"
  | "squint" | "love" | "star" | "side" | "half";

function eyes(kind: EyeKind, wink = false): Px[] {
  const left = (k: EyeKind): Px[] => {
    switch (k) {
      case "open":   return [[11, 14, 2, 4]];
      case "blink":  return [[10, 16, 4, 1]];
      case "arc":    return [[10, 16, 1, 1], [11, 15, 2, 1], [13, 16, 1, 1]];
      case "wide":   return [[10, 13, 3, 5]];
      case "sleepy": return [[10, 15, 4, 1], [10, 17, 3, 1]];
      case "squint": return [[10, 16, 4, 2]];
      case "love":   return [[10, 14, 1, 1], [12, 14, 1, 1], [10, 15, 3, 1], [11, 16, 1, 1]];
      case "star":   return [[11, 14, 1, 3], [10, 15, 3, 1]];
      case "side":   return [[12, 14, 2, 4]];
      case "half":   return [[10, 15, 4, 1], [11, 16, 2, 2]];
    }
  };
  const l = left(kind);
  const r = (wink ? left("arc") : l).map(mirror);
  return [...l, ...r];
}

type MouthKind = "smile" | "grin" | "open" | "flat" | "small" | "sad" | "ooo";

const NOSE: Px[] = [[15, 16, 2, 1], [15, 17, 2, 1]];

function mouth(kind: MouthKind): Px[] {
  switch (kind) {
    case "smile":
      return [...NOSE, ...pairAll([[13, 19, 1, 1], [14, 20, 2, 1]])];
    case "grin":
      return [...NOSE, ...pairAll([[12, 19, 1, 1], [13, 20, 3, 1]])];
    case "open":
      return [...NOSE, [14, 19, 4, 1], [14, 20, 1, 1], [17, 20, 1, 1], [14, 21, 4, 1]];
    case "flat":
      return [...NOSE, [14, 20, 4, 1]];
    case "small":
      return [...NOSE, [15, 20, 2, 1]];
    case "sad":
      return [...NOSE, ...pairAll([[13, 21, 1, 1], [14, 20, 2, 1]])];
    case "ooo":
      return [...NOSE, [15, 19, 2, 1], [15, 20, 2, 1], [14, 19, 1, 2], [17, 19, 1, 2]];
  }
}

/* ---------- the 15 frames ---------- */

interface Frame {
  name: string;
  eye: EyeKind;
  wink?: boolean;
  mouth: MouthKind;
  /** extra flourish drawn beside the head */
  flair?: "none" | "wave" | "zzz" | "spark" | "note" | "bang";
  tilt?: number;
}

export const FRAMES: Frame[] = [
  { name: "IDLE",      eye: "open",   mouth: "smile" },
  { name: "BLINK",     eye: "blink",  mouth: "smile" },
  { name: "HAPPY",     eye: "arc",    mouth: "grin",  flair: "spark" },
  { name: "WINK",      eye: "open",   wink: true, mouth: "grin" },
  { name: "CURIOUS",   eye: "wide",   mouth: "small", tilt: -6 },
  { name: "SURPRISED", eye: "wide",   mouth: "ooo",   flair: "bang" },
  { name: "SLEEPY",    eye: "sleepy", mouth: "flat",  flair: "zzz" },
  { name: "EXCITED",   eye: "arc",    mouth: "open",  flair: "spark" },
  { name: "SMITTEN",   eye: "love",   mouth: "grin",  flair: "note" },
  { name: "THINKING",  eye: "side",   mouth: "small", tilt: 5 },
  { name: "GLITCH",    eye: "squint", mouth: "flat" },
  { name: "GREET",     eye: "open",   mouth: "grin",  flair: "wave" },
  { name: "SULKY",     eye: "half",   mouth: "sad",   tilt: 4 },
  { name: "FOCUSED",   eye: "squint", mouth: "small" },
  { name: "STARRY",    eye: "star",   mouth: "grin",  flair: "spark" },
];

const FLAIR: Record<string, Px[]> = {
  none: [],
  wave: [[27, 12, 2, 2], [29, 10, 2, 2], [28, 14, 3, 1]],
  zzz: [[26, 2, 3, 1], [28, 3, 1, 1], [27, 4, 1, 1], [26, 5, 3, 1]],
  spark: [[1, 3, 1, 1], [0, 4, 3, 1], [1, 5, 1, 1], [29, 4, 1, 1], [28, 5, 3, 1], [29, 6, 1, 1]],
  note: [[27, 2, 1, 4], [28, 2, 2, 1], [26, 6, 2, 1]],
  bang: [[28, 2, 1, 3], [28, 6, 1, 1], [2, 2, 1, 3], [2, 6, 1, 1]],
};

/* ---------- personality ---------- */

const GREETINGS = [
  "sup. i live here.",
  "you clicked me. bold.",
  "still compiling my thoughts…",
  "try 'dragon' in the console ;)",
  "i guard the archive. mostly i nap.",
  "purr… i mean, system nominal.",
  "yashftw pays me in electricity.",
  "i've read every commit. all of them.",
  "snow leopard. cyan variant. rare.",
  "wanna see the projects? click one.",
  "404: motivation not found",
  "i'm 15 frames of pure charisma.",
];

const rnd = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

/* ---------- sprite ---------- */

const Sprite = ({ frame, size }: { frame: Frame; size: number }) => {
  const line = "hsl(var(--primary))";
  const fill = "hsl(var(--primary) / 0.75)";

  const outline: Px[] = [...HEAD, ...SCREEN, ...COLLAR, ...EAR_OUTLINE];
  const solid: Px[] = [
    ...EAR_FILL,
    ...SPOTS,
    ...WHISKERS,
    ...COLLAR_GLYPH,
    ...eyes(frame.eye, frame.wink),
    ...mouth(frame.mouth),
    ...(FLAIR[frame.flair ?? "none"] ?? []),
  ];

  return (
    <svg
      width={size}
      height={(size / 32) * 30}
      viewBox="0 0 32 30"
      shapeRendering="crispEdges"
      style={{ transform: `rotate(${frame.tilt ?? 0}deg)`, transition: "transform 220ms ease" }}
      aria-hidden="true"
    >
      {outline.map(([x, y, w, h], i) => (
        <rect key={`o${i}`} x={x} y={y} width={w} height={h} fill={line} />
      ))}
      {solid.map(([x, y, w, h], i) => (
        <rect key={`s${i}`} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
};

/* ---------- roaming buddy ---------- */

const byName = (n: string) => FRAMES.findIndex((f) => f.name === n);

const PixelBuddy = () => {
  const [frameIdx, setFrameIdx] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 24, y: 0 });
  const [facing, setFacing] = useState(1);
  const [walking, setWalking] = useState(false);

  const seqRef = useRef<number[]>([]);
  const timers = useRef<number[]>([]);
  const hovering = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /** Play a named sequence of frames, then settle back to idle. */
  const play = useCallback((names: string[], hold = 900) => {
    seqRef.current = names.map(byName).filter((i) => i >= 0);
    seqRef.current.forEach((f, i) => later(() => setFrameIdx(f), i * hold));
    later(() => setFrameIdx(0), seqRef.current.length * hold);
  }, []);

  /* idle blinking + the occasional spontaneous mood */
  useEffect(() => {
    let stop = false;
    const tick = () => {
      if (stop) return;
      if (!hovering.current) {
        const roll = Math.random();
        if (roll < 0.55) {
          setFrameIdx(byName("BLINK"));
          window.setTimeout(() => !stop && setFrameIdx(0), 150);
        } else {
          const mood = rnd(["SLEEPY", "THINKING", "HAPPY", "STARRY", "FOCUSED", "SULKY"]);
          setFrameIdx(byName(mood));
          window.setTimeout(() => !stop && setFrameIdx(0), 1600);
        }
      }
      window.setTimeout(tick, 2600 + Math.random() * 3600);
    };
    const t = window.setTimeout(tick, 2000);
    return () => {
      stop = true;
      window.clearTimeout(t);
    };
  }, []);

  /* roam: drift between the gutters and edges of the viewport */
  useEffect(() => {
    let stop = false;
    const roam = () => {
      if (stop) return;
      const margin = 8;
      const bw = 88;
      const bh = 96;
      const maxY = Math.max(margin, window.innerHeight - bh - 96);

      // Always hug a side edge so the buddy patrols the margins instead of
      // wandering across the panels.
      const lane = Math.max(0, Math.min(96, (window.innerWidth - 1400) / 2));
      const onLeft = Math.random() < 0.5;
      const jitter = Math.random() * lane;
      const x = onLeft
        ? margin + jitter
        : window.innerWidth - bw - margin - jitter;
      const y = 90 + Math.random() * Math.max(1, maxY - 90);

      setPos((prev) => {
        setFacing(x >= prev.x ? 1 : -1);
        return { x, y: Math.min(y, maxY) };
      });
      setWalking(true);
      window.setTimeout(() => !stop && setWalking(false), 2600);
      window.setTimeout(roam, 6500 + Math.random() * 5000);
    };
    const t = window.setTimeout(roam, 1200);
    return () => {
      stop = true;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => clearTimers, []);

  const onEnter = () => {
    hovering.current = true;
    clearTimers();
    setFrameIdx(byName("CURIOUS"));
  };

  const onLeave = () => {
    hovering.current = false;
    setFrameIdx(0);
  };

  const onClick = () => {
    clearTimers();
    setBubble(rnd(GREETINGS));
    play(["SURPRISED", "EXCITED", "SMITTEN", "WINK"], 420);
    later(() => setBubble(null), 3200);
  };

  const frame = FRAMES[frameIdx] ?? FRAMES[0];

  return (
    <div
      className="fixed z-[60] hidden md:block select-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 2.6s cubic-bezier(0.45, 0, 0.25, 1)",
      }}
    >
      {/* speech bubble */}
      {bubble && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[190px] flicker-in">
          <div className="hud-box" style={{ ["--hud-fill" as string]: "hsl(var(--card))" }}>
            <div className="px-2.5 py-1.5 font-terminal text-[13px] leading-tight text-foreground text-center">
              {bubble}
            </div>
          </div>
        </div>
      )}

      <button
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label={`Nyx the archive buddy — ${frame.name.toLowerCase()}`}
        className="interactive block bg-transparent creature-idle hud-glow"
        style={{ transform: `scaleX(${facing})` }}
      >
        <Sprite frame={frame} size={72} />
      </button>

      {/* status tag */}
      <div className="mt-0.5 text-center font-pixel text-[6px] tracking-widest text-primary/70">
        {walking ? "···" : frame.name}
      </div>
    </div>
  );
};

export default PixelBuddy;
