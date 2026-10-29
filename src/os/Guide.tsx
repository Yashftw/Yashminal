import { useCallback, useEffect, useRef, useState } from "react";
import { FRAMES, GREETINGS, Sprite, byName, rnd } from "@/components/PixelBuddy";
import { sfx } from "./sound";
import { TASKBAR_H, type Win } from "./Window";

/* NYX, the tutorial guide. Static, opaque, and only ever moves by glitching:
   the first time you open an app it teleports next to that window and
   explains it once. Hover hints inside apps are one-shot too. */

const INTRO: Record<string, string> = {
  home: "Welcome. Open any app and I'll explain it, once.",
  about: "This is the dossier on Yash: who he is, what he's studying and the face behind the handle.",
  projects: "Five builds live in here. Hover a card and I'll tell you what it is, click to open its file.",
  skills: "Skill diagnostics: the tools and tech Yash works with, rated by how deep he's gone.",
  objectives: "Objectives: where Yash is heading and the capabilities he's building toward.",
  contact: "Want to hire him or just say hi? Fill this out and the message goes straight to his inbox.",
  links: "Outbound channels: GitHub for the code, LinkedIn for the career. I'll warn you before you leave.",
  resume: "The resume, right here. Scroll through it or open it in a new tab.",
  status: "System monitor: a quick read on what's active, what's learning and what's finished.",
  music: "Ambient soundtrack. Press play and keep this window open to keep it going.",
  doom: "Yes, it really is DOOM. Yash compiled the original 1993 source to WebAssembly. Click it, arrows or WASD to move, Ctrl to shoot.",
  terminal: "A real shell. Type help, then try open projects. Or dragon if you're feeling brave.",
};

interface Job {
  appId: string;
  text: string;
}

const W = 230; // widget width (bubble + sprite)
const H = 215; // widget height with a bubble, used for placement

const Guide = ({ wins, mobile }: { wins: Win[]; mobile: boolean }) => {
  const [pos, setPos] = useState<{ x: number; bottom: number } | null>(null); // null = home corner
  const [text, setText] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [fx, setFx] = useState<"" | "out" | "in">("");
  const [frameIdx, setFrameIdx] = useState(0);
  const [vw, setVw] = useState(() => window.innerWidth);

  const winsRef = useRef(wins);
  winsRef.current = wins;
  const seen = useRef(new Set<string>());
  const queue = useRef<Job[]>([]);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const posRef = useRef(pos);
  posRef.current = pos;

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /** A random spot around the window: beside it, above/below it, or tucked
   *  over one of its corners. Never the same spot twice in a row. */
  const placeFor = useCallback((w: Win | null) => {
    if (!w) return null;
    const el = document.querySelector<HTMLElement>(`[data-win="${w.id}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const availH = window.innerHeight - TASKBAR_H;
    const rand = (min: number, max: number) => min + Math.random() * Math.max(0, max - min);
    const clampX = (x: number) => Math.min(Math.max(x, 8), vw - W - 8);
    const clampTop = (t: number) => Math.min(Math.max(t, 8), availH - H - 8);

    const spots: { x: number; top: number }[] = [];
    if (!w.maximized) {
      if (r.right + 10 + W <= vw) spots.push({ x: r.right + 10, top: clampTop(rand(r.top - 30, r.bottom - H + 30)) });
      if (r.left - 10 - W >= 0) spots.push({ x: r.left - 10 - W, top: clampTop(rand(r.top - 30, r.bottom - H + 30)) });
      if (r.bottom + 10 + H <= availH) spots.push({ x: clampX(rand(r.left - 40, r.right - W + 40)), top: r.bottom + 10 });
      if (r.top - 10 - H >= 8) spots.push({ x: clampX(rand(r.left - 40, r.right - W + 40)), top: r.top - 10 - H });
    }
    if (!spots.length) {
      // no room around it: perch over a random corner of the window
      const left = Math.random() < 0.5;
      const bottom = Math.random() < 0.5;
      spots.push({
        x: clampX(left ? r.left + 12 : r.right - W - 12),
        top: clampTop(bottom ? r.bottom - H - 12 : r.top + 44),
      });
    }

    const cur = posRef.current;
    const fresh = spots.filter((s) => !cur || Math.abs(s.x - cur.x) > 40 || Math.abs(window.innerHeight - (s.top + H) - cur.bottom) > 40);
    const pick = (fresh.length ? fresh : spots)[Math.floor(Math.random() * (fresh.length || spots.length))];
    return { x: pick.x, bottom: window.innerHeight - (pick.top + H) };
  }, []);

  const speak = useCallback(
    (full: string, then: () => void) => {
      setText(full);
      setTyped("");
      let i = 0;
      const iv = window.setInterval(() => {
        i += 1;
        setTyped(full.slice(0, i));
        setFrameIdx(i % 4 < 2 ? byName("IDLE") : byName("HAPPY"));
        if (i >= full.length) {
          window.clearInterval(iv);
          setFrameIdx(0);
          later(() => {
            setText(null);
            later(then, 350);
          }, 2200 + full.length * 22);
        }
      }, 24);
      timers.current.push(iv);
    },
    [later],
  );

  const glitchTo = useCallback(
    (to: { x: number; bottom: number } | null, after: () => void) => {
      sfx.zap();
      setFx("out");
      later(() => {
        setPos(to);
        setFx("in");
        later(() => {
          setFx("");
          after();
        }, 430);
      }, 270);
    },
    [later],
  );

  const next = useCallback(() => {
    const job = queue.current.shift();
    if (!job) {
      busy.current = false;
      if (posRef.current) glitchTo(null, () => {});
      return;
    }
    busy.current = true;

    if (job.appId === "home") {
      speak(job.text, next);
      return;
    }
    const w = winsRef.current.find((x) => x.appId === job.appId && !x.closing) ?? null;
    const to = placeFor(w);
    if (!to) {
      next();
      return;
    }
    glitchTo(to, () => speak(job.text, next));
  }, [glitchTo, placeFor, speak]);

  const enqueue = useCallback(
    (job: Job) => {
      queue.current.push(job);
      if (!busy.current) next();
    },
    [next],
  );

  useEffect(() => {
    if (mobile) return;
    const onOpen = (e: Event) => {
      const { appId } = (e as CustomEvent<{ appId: string }>).detail;
      const key = `open:${appId}`;
      if (seen.current.has(key) || !INTRO[appId]) return;
      seen.current.add(key);
      // wait for the window's own glitch-in to settle before moving over
      later(() => enqueue({ appId, text: INTRO[appId] }), 750);
    };
    const onHint = (e: Event) => {
      const { appId, key, text: t } = (e as CustomEvent<{ appId: string; key: string; text: string }>).detail;
      const k = `hint:${key}`;
      if (seen.current.has(k)) return;
      seen.current.add(k);
      enqueue({ appId, text: t });
    };
    window.addEventListener("guide:open", onOpen);
    window.addEventListener("guide:hint", onHint);
    seen.current.add("open:home");
    later(() => enqueue({ appId: "home", text: INTRO.home }), 1400);
    const ts = timers.current;
    return () => {
      window.removeEventListener("guide:open", onOpen);
      window.removeEventListener("guide:hint", onHint);
      ts.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [mobile, enqueue, later]);

  if (mobile) return null;

  const x = pos ? pos.x : vw - W - 12;
  const bottom = pos ? pos.bottom : TASKBAR_H + 10;
  const frame = FRAMES[frameIdx] ?? FRAMES[0];

  const onClick = () => {
    if (busy.current || text) return;
    sfx.click();
    busy.current = true;
    speak(rnd(GREETINGS), () => {
      busy.current = false;
      if (queue.current.length) next();
    });
  };

  return (
    <div
      className={`absolute flex flex-col items-end gap-2 select-none ${
        fx === "out" ? "guide-out" : fx === "in" ? "guide-in" : ""
      }`}
      style={{ left: x, bottom, width: W, zIndex: 8000, pointerEvents: "none" }}
    >
      {text && (
        <div
          className="w-full border-2 border-primary bg-card px-3 py-2 font-terminal text-lg leading-tight text-foreground"
          style={{ boxShadow: "0 0 16px hsl(var(--primary) / 0.45)", pointerEvents: "auto" }}
        >
          {typed}
          <span className="blink-cursor" />
        </div>
      )}
      <button
        onClick={onClick}
        aria-label="Nyx, your guide"
        className="interactive block"
        style={{ pointerEvents: "auto", filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
      >
        <Sprite frame={frame} size={62} />
      </button>
    </div>
  );
};

export default Guide;
