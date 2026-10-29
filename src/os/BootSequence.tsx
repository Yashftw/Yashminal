import { useCallback, useEffect, useRef, useState } from "react";
import { Power } from "lucide-react";
import { sfx } from "./sound";

type Stage = "off" | "warm" | "post" | "load" | "flash";

interface Props {
  onDone: () => void;
  /** "off" waits on the power button; "warm" boots straight away (restart). */
  startAt?: "off" | "warm";
  /** Line shown above the power button (e.g. after a shutdown). */
  notice?: string;
}

interface PostLine {
  at: number;
  text: string;
  tone?: "head" | "ok" | "dim";
  beep?: number;
  seek?: boolean;
}

const POST_LINES: PostLine[] = [
  { at: 0, text: "YASHMINAL BIOS v2.6.1 — (C) 2026 YASHFTW SYSTEMS", tone: "head", beep: 1000 },
  { at: 260, text: "CPU : NEON-CORE X9 @ 4.20 GHz ................ OK" },
  { at: 480, text: "BIOS DATE : 10/26/26   BUILD : GLITCH-STABLE", tone: "dim" },
  { at: 760, text: "@MEM" },
  { at: 1950, text: "DETECTING PRIMARY MASTER ... PORTFOLIO.HDD 512GB", seek: true },
  { at: 2150, text: "DETECTING PRIMARY SLAVE ... NONE", tone: "dim", seek: true },
  { at: 2350, text: "DISPLAY : NEON-CRT 1920x1080 ................. OK", seek: true },
  { at: 2550, text: "AUDIO   : SYNTH-16 ........................... OK" },
  { at: 2750, text: "NETWORK : LINK ESTABLISHED ................... OK" },
  { at: 3050, text: "PRESS [DEL] TO ENTER SETUP ... (ACCESS DENIED)", tone: "dim", beep: 700 },
  { at: 3450, text: "BOOTING FROM PORTFOLIO.HDD ...", tone: "head", beep: 1300 },
];
const POST_END = 4000;
const LOAD_MS = 2800;

const LOAD_STEPS = [
  "mounting /dev/portfolio",
  "loading drivers: neon.sys glitch.sys crt.sys",
  "spawning window manager",
  "decrypting user profile: YASHFTW",
  "starting desktop",
];

/** Low-res TV static drawn on a canvas and scaled up. */
const Static = ({ opacity = 1 }: { opacity?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const g = cv?.getContext("2d");
    if (!cv || !g) return;
    const w = (cv.width = 200);
    const h = (cv.height = 120);
    const img = g.createImageData(w, h);
    let raf = 0;
    const draw = () => {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v * 0.4;
        d[i + 1] = v * 0.9;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated", opacity }}
    />
  );
};

const BootSequence = ({ onDone, startAt = "off", notice }: Props) => {
  const [stage, setStage] = useState<Stage>(startAt);
  const [lines, setLines] = useState<PostLine[]>([]);
  const [mem, setMem] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadStep, setLoadStep] = useState(0);
  const stopHum = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);
  const done = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearAll = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    clearAll();
    sfx.chime();
    sfx.staticBurst(0.35, 0.3);
    setStage("flash");
    stopHum.current?.();
    window.setTimeout(onDone, 520);
  }, [onDone, clearAll]);

  const toLoad = useCallback(() => {
    clearAll();
    setStage("load");
  }, [clearAll]);

  const power = useCallback(() => {
    sfx.unlock();
    sfx.powerOn();
    setStage("warm");
  }, []);

  /* warm-up: tube charges, static + whine, then POST */
  useEffect(() => {
    if (stage !== "warm") return;
    stopHum.current = sfx.startHum();
    sfx.staticBurst(1.1, 0.3);
    sfx.whine(2);
    later(() => setStage("post"), 1300);
  }, [stage, later]);

  /* POST: scripted BIOS lines + memory count */
  useEffect(() => {
    if (stage !== "post") return;
    setLines([]);
    POST_LINES.forEach((l) =>
      later(() => {
        setLines((p) => [...p, l]);
        if (l.beep) sfx.beep(l.beep, 0.12);
        if (l.seek) sfx.seek();
        if (l.text === "@MEM") {
          const total = 65536;
          const start = performance.now();
          const tick = window.setInterval(() => {
            const p = Math.min(1, (performance.now() - start) / 1100);
            setMem(Math.round(total * p));
            if (Math.random() < 0.5) sfx.seek();
            if (p >= 1) {
              window.clearInterval(tick);
              sfx.beep(1000, 0.1);
            }
          }, 55);
          timers.current.push(tick);
        }
      }, l.at),
    );
    later(toLoad, POST_END);
  }, [stage, later, toLoad]);

  /* loader: progress bar + status lines + seek clicks */
  useEffect(() => {
    if (stage !== "load") return;
    const start = performance.now();
    let raf = 0;
    let lastSeek = 0;
    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / LOAD_MS);
      // uneven progress like a real loader
      const eased = p < 0.5 ? p * 0.8 : 0.4 + (p - 0.5) * 1.2;
      setProgress(Math.min(1, eased));
      setLoadStep(Math.min(LOAD_STEPS.length - 1, Math.floor(p * LOAD_STEPS.length)));
      if (now - lastSeek > 130 + Math.random() * 120) {
        sfx.seek();
        lastSeek = now;
      }
      if (p < 1) raf = requestAnimationFrame(loop);
      else finish();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stage, finish]);

  /* skip with any key during POST */
  useEffect(() => {
    if (stage !== "post") return;
    const onKey = () => toLoad();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, toLoad]);

  /* restart path: boot immediately (audio already unlocked by an earlier click) */
  useEffect(() => {
    if (startAt === "warm") sfx.powerOn();
    return () => {
      clearAll();
      stopHum.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blocks = 28;
  const lit = Math.floor(progress * blocks);

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden bg-black text-primary select-none">
      {stage === "off" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
          {notice && (
            <p className="font-terminal text-lg sm:text-xl text-primary/70 max-w-md leading-tight">
              {notice}
            </p>
          )}
          <button
            onClick={power}
            aria-label="Power on"
            className="interactive group relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/70 text-primary boot-power"
          >
            <Power className="h-10 w-10 transition-transform group-hover:scale-110" strokeWidth={2.2} />
          </button>
          <p className="font-pixel text-[10px] tracking-[0.3em] text-primary/80 boot-blink">
            PRESS POWER TO BOOT
          </p>
          <p className="font-terminal text-sm text-muted-foreground">(sound on — turn your volume up)</p>
        </div>
      )}

      {stage === "warm" && (
        <>
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 crt-warmup">
            <Static opacity={0.55} />
          </div>
        </>
      )}

      {stage === "post" && (
        <div className="absolute inset-0 p-5 sm:p-10 font-terminal text-lg sm:text-2xl leading-tight boot-jitter-slow">
          <div className="max-w-3xl space-y-0.5">
            {lines.map((l, i) =>
              l.text === "@MEM" ? (
                <div key={i}>
                  MEMORY TEST : {String(mem ?? 0).padStart(5, "0")}K{" "}
                  {mem === 65536 && <span className="text-primary">OK</span>}
                </div>
              ) : (
                <div
                  key={i}
                  className={
                    l.tone === "head"
                      ? "text-primary boot-glow"
                      : l.tone === "dim"
                        ? "text-primary/50"
                        : "text-primary/90"
                  }
                >
                  {l.text}
                </div>
              ),
            )}
            <span className="inline-block h-5 w-3 translate-y-1 bg-primary boot-blink" />
          </div>
          <button
            onClick={toLoad}
            className="interactive absolute bottom-5 right-5 font-pixel text-[9px] tracking-widest text-primary/60 hover:text-primary"
          >
            SKIP ▸▸
          </button>
        </div>
      )}

      {stage === "load" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
          <div className="text-center boot-jitter">
            <h1 className="font-pixel text-2xl sm:text-5xl tracking-[0.12em] boot-logo">YASHMINAL</h1>
            <p className="mt-3 font-pixel text-[10px] sm:text-xs tracking-[0.5em] text-primary/70">
              OS · NEON EDITION
            </p>
          </div>
          <div className="w-full max-w-xl">
            <div className="flex gap-[3px] border-2 border-primary/60 p-1.5 boot-bar-glow">
              {Array.from({ length: blocks }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 flex-1 ${i < lit ? "bg-primary" : "bg-primary/10"}`}
                  style={i < lit ? { boxShadow: "0 0 8px hsl(var(--primary))" } : undefined}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between font-terminal text-lg text-primary/80">
              <span>▸ {LOAD_STEPS[loadStep]}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {stage === "flash" && <div className="absolute inset-0 boot-flash" />}

      {/* scanlines + vignette over everything */}
      <div className="pointer-events-none absolute inset-0 boot-scan" />
      <div className="pointer-events-none absolute inset-0 boot-vignette" />
    </div>
  );
};

export default BootSequence;
