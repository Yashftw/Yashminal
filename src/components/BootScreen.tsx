import { memo, useEffect, useMemo, useRef, useState } from "react";

const BOOT_LINES = [
  "BOOTING CYBER ARCHIVE",
  "",
  "ENTITY:    YASHFTW",
  "SIGNAL:    UNSTABLE",
  "STATUS:    ONLINE",
  "",
  "SYSTEM INTEGRITY ......... OK",
  "DECRYPTING HEADERS ....... OK",
  "ESTABLISHING CHANNEL ..... OK",
  "",
  "▸ ALL SYSTEMS NOMINAL",
  "▸ ENTERING ARCHIVE",
];

const TYPE_MS = 3200; // total type-out duration
const HOLD_MS = 480; // beat on 100% before the wipe
const FADE_MS = 620;

/* ---------- side circuitry ---------- */

interface NodeSpec {
  at: number; // % progress at which it energises
  len: number; // branch length in px
  size: number; // node square size in px
  tag: string;
}

const NODES: NodeSpec[] = Array.from({ length: 15 }, (_, i) => {
  const lens = [34, 58, 26, 46, 70, 30, 52, 38];
  return {
    at: 2 + i * 6.6,
    len: lens[i % lens.length],
    size: i % 4 === 0 ? 9 : i % 3 === 0 ? 7 : 5,
    tag: (0x2f + i * 0x1d).toString(16).toUpperCase().padStart(2, "0"),
  };
});

/** One column of cyber nodes. Memoised on the integer progress so it only
 *  re-renders when a node could actually change state. */
const NodeColumn = memo(({ progress, mirrored }: { progress: number; mirrored?: boolean }) => {
  const p = progress / 100;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 hidden sm:block w-[150px] lg:w-[230px] ${
        mirrored ? "right-0 -scale-x-100" : "left-0"
      }`}
      style={{ opacity: 0.16 + 0.84 * p }}
    >
      {/* bus spine — dim track */}
      <div className="absolute inset-y-0 left-4 w-px bg-primary/20" />

      {/* bus spine — energised fill, tracks the loader */}
      <div
        className="absolute top-0 left-4 w-px bg-primary will-change-[height]"
        style={{
          height: `${progress}%`,
          boxShadow: `0 0 ${4 + 10 * p}px hsl(var(--primary) / ${0.4 + 0.5 * p})`,
        }}
      />

      {/* travelling data pulse */}
      <div className="absolute left-4 -ml-[2px] w-[5px] h-[5px] bg-primary boot-pulse-travel" />

      {NODES.map((n, i) => {
        const lit = progress >= n.at;
        const top = 4 + i * 6.4;
        return (
          <div key={i} className="absolute" style={{ top: `${top}%`, left: "1rem" }}>
            {/* branch trace */}
            <div
              className="absolute top-1/2 h-px origin-left transition-[width,background-color] duration-500 ease-out"
              style={{
                width: lit ? n.len : 6,
                background: lit ? "hsl(var(--primary) / 0.75)" : "hsl(var(--primary) / 0.18)",
              }}
            />
            {/* node */}
            <div
              className="absolute -translate-y-1/2 rotate-45 transition-all duration-500 ease-out"
              style={{
                left: lit ? n.len : 6,
                width: n.size,
                height: n.size,
                background: lit ? "hsl(var(--primary))" : "transparent",
                border: `1px solid hsl(var(--primary) / ${lit ? 1 : 0.25})`,
                boxShadow: lit ? `0 0 ${5 + 12 * p}px hsl(var(--primary) / ${0.5 + 0.5 * p})` : "none",
              }}
            />
            {/* hex tag appears once energised */}
            <span
              className="absolute top-1/2 -translate-y-1/2 font-pixel text-[6px] tracking-widest text-primary/70 transition-opacity duration-500"
              style={{
                left: lit ? n.len + n.size + 6 : n.len,
                opacity: lit ? 1 : 0,
                transform: mirrored ? "translateY(-50%) scaleX(-1)" : undefined,
              }}
            >
              {n.tag}
            </span>
          </div>
        );
      })}
    </div>
  );
});
NodeColumn.displayName = "NodeColumn";

/* ---------- boot screen ---------- */

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [revealed, setRevealed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const totalChars = useMemo(
    () => BOOT_LINES.reduce((acc, l) => acc + l.length + 1, 0),
    []
  );

  /* One rAF loop drives both the type-out and the loader: at most a single
     state update per frame, instead of a timeout per character. */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(totalChars);
      setProgress(100);
      const t = window.setTimeout(() => {
        setDone(true);
        window.setTimeout(() => onCompleteRef.current(), FADE_MS);
      }, HOLD_MS);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    let holdTimer = 0;
    let fadeTimer = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const e = Math.min(1, (now - start) / TYPE_MS);
      setRevealed(Math.round(e * totalChars));
      setProgress(Math.round(e * 100));

      if (e < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        holdTimer = window.setTimeout(() => {
          setDone(true);
          fadeTimer = window.setTimeout(() => onCompleteRef.current(), FADE_MS);
        }, HOLD_MS);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [totalChars]);

  /** Slice the script down to what's been "typed" so far. */
  const visible = useMemo(() => {
    const out: string[] = [];
    let budget = revealed;
    for (const line of BOOT_LINES) {
      if (budget <= 0) break;
      out.push(line.slice(0, budget));
      budget -= line.length + 1;
    }
    return out;
  }, [revealed]);

  const pct = progress / 100;
  const SEGMENTS = 32;
  const litSegments = Math.round(pct * SEGMENTS);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-background flex items-center justify-center overflow-hidden"
      style={{
        opacity: done ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* depth wash that warms up as the boot completes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, hsl(var(--primary) / 0.10), transparent 62%)",
          opacity: 0.25 + 0.75 * pct,
        }}
      />
      <div className="crt-overlay" />

      <NodeColumn progress={progress} />
      <NodeColumn progress={progress} mirrored />

      {/* console */}
      <div className="relative w-full max-w-xl px-6">
        <div className="hud-frame hud-glow">
          <div className="hud-frame-body bg-card/70 backdrop-blur-sm">
            {/* title bar */}
            <div className="flex items-center justify-between border-b-2 border-border bg-gradient-to-r from-accent to-accent/60 px-4 py-2">
              <span className="font-pixel text-[9px] tracking-widest text-primary">
                YASHMINAL BIOS
              </span>
              <span className="font-terminal text-xs text-muted-foreground">
                v5.0 · <span className="text-primary status-dot">●</span> LINK
              </span>
            </div>

            {/* Boot log. Height is fixed so the panel never jumps as lines land —
                it must clear all 12 lines (12 × 16px × 1.45 ≈ 279px) plus padding. */}
            <div className="px-5 pt-4 pb-3 font-terminal text-base leading-[1.45] h-[312px] overflow-hidden">
              {visible.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith("▸")
                      ? "text-primary text-glow"
                      : /^(ENTITY|SIGNAL|STATUS)/.test(line)
                      ? "text-foreground"
                      : "text-primary/70"
                  }
                >
                  {line || " "}
                  {i === visible.length - 1 && !done && (
                    <span className="blink-cursor" />
                  )}
                </div>
              ))}
            </div>

            {/* segmented loader */}
            <div className="px-5 pb-4">
              <div className="flex gap-[3px]">
                {Array.from({ length: SEGMENTS }).map((_, i) => {
                  const on = i < litSegments;
                  return (
                    <span
                      key={i}
                      className="h-2.5 flex-1 transition-colors duration-150"
                      style={{
                        background: on
                          ? "hsl(var(--primary))"
                          : "hsl(var(--primary) / 0.12)",
                        boxShadow:
                          on && i >= litSegments - 3
                            ? "0 0 8px hsl(var(--primary) / 0.8)"
                            : "none",
                      }}
                    />
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between font-terminal text-xs">
                <span className="text-muted-foreground">
                  {progress < 100 ? "DECRYPTING ARCHIVE…" : "ARCHIVE UNSEALED"}
                </span>
                <span className="font-pixel text-[10px] text-primary tabular-nums">
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* readout strip under the console */}
        <div className="mt-3 flex items-center justify-between px-1 font-pixel text-[7px] tracking-widest text-primary/45">
          <span>NODES {String(Math.round(pct * NODES.length * 2)).padStart(2, "0")}/30</span>
          <span>BUS ▓ {progress < 100 ? "SYNC" : "LOCKED"}</span>
          <span>SEC ◈ {progress < 55 ? "SEALED" : "OPEN"}</span>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;
