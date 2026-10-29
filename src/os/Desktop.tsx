import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Moon, Power, RotateCcw, Sun, Volume2, VolumeX } from "lucide-react";
import { GridScan } from "@/components/GridScan";
import CRTOverlay from "@/components/CRTOverlay";
import Guide from "./Guide";
import { guideBus } from "./guideBus";
import { useIsMobile } from "@/hooks/use-mobile";
import { APPS, APP_MAP } from "./apps";
import { sfx } from "./sound";
import { useTheme } from "./theme";
import type { OSApi } from "./types";
import Window, { TASKBAR_H, type Win } from "./Window";

interface Props {
  onRestart: () => void;
  onShutdown: () => void;
}

const Clock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className="font-terminal text-lg text-primary tabular-nums">
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
};

const Desktop = ({ onRestart, onShutdown }: Props) => {
  const mobile = useIsMobile();
  const { dark, toggle: toggleTheme } = useTheme();
  const [wins, setWins] = useState<Win[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [muted, setMutedState] = useState(sfx.isMuted());
  const zRef = useRef(100); // above the roaming pixel buddy (z-60)
  const cascade = useRef(0);
  const startRef = useRef<HTMLDivElement>(null);

  useEffect(() => sfx.subscribe(() => setMutedState(sfx.isMuted())), []);

  /* close start menu on outside click / Escape */
  useEffect(() => {
    if (!startOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!startRef.current?.contains(e.target as Node)) setStartOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStartOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [startOpen]);

  const bringToFront = useCallback((id: string) => {
    zRef.current += 1;
    const z = zRef.current;
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
    setFocusId(id);
  }, []);

  const openApp = useCallback(
    (appId: string) => {
      const app = APP_MAP[appId];
      if (!app) return;
      setStartOpen(false);
      setWins((ws) => {
        const existing = ws.find((w) => w.appId === appId && !w.closing);
        zRef.current += 1;
        const z = zRef.current;
        if (existing) {
          setFocusId(existing.id);
          return ws.map((w) => (w.id === existing.id ? { ...w, z, minimized: false } : w));
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight - TASKBAR_H;
        const w = Math.min(app.w, vw - 24);
        const h = app.fixedH ? Math.min(app.h ?? 400, vh - 24) : null;
        const off = (cascade.current++ % 7) * 28;
        const minX = vw > 1000 ? 230 : 8; // keep clear of the icon columns
        const x = Math.max(minX, Math.min((vw - w) / 2 + off, vw - w - 8));
        const y = h
          ? Math.max(8, Math.min((vh - h) / 2 + off - 30, vh - h - 8))
          : Math.min(40 + off, Math.max(8, vh - 260));
        const id = `${appId}-${Date.now()}`;
        setFocusId(id);
        guideBus.opened(appId);
        return [...ws, { id, appId, z, x, y, w, h, minimized: false, maximized: !!app.openMaximized, closing: false }];
      });
    },
    [],
  );

  const patch = useCallback((id: string, p: Partial<Win>) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...p } : w)));
  }, []);

  const close = useCallback((id: string) => {
    sfx.close();
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)));
    window.setTimeout(() => setWins((ws) => ws.filter((w) => w.id !== id)), 240);
    setFocusId((f) => (f === id ? null : f));
  }, []);

  const minimize = useCallback((id: string) => {
    sfx.click();
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setFocusId((f) => (f === id ? null : f));
  }, []);

  const toggleMute = useCallback(() => sfx.setMuted(!sfx.isMuted()), []);

  const os: OSApi = useMemo(
    () => ({
      openApp,
      restart: onRestart,
      shutdown: onShutdown,
      toggleTheme,
      toggleMute,
      dark,
      muted,
    }),
    [openApp, onRestart, onShutdown, toggleTheme, toggleMute, dark, muted],
  );

  const coarse = mobile || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);

  const onTaskClick = (w: Win) => {
    sfx.click();
    if (w.minimized || focusId !== w.id) bringToFront(w.id);
    else minimize(w.id);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-background desktop-in"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelected(null);
      }}
    >
      <div className="wallpaper pointer-events-none absolute inset-0" />
      <GridScan
        mouseReactive={false}
        linesColor="#0B2A3C"
        scanColor="#0BB7FF"
        scanOpacity={0.3}
        noiseIntensity={0.012}
        chromaticAberration={0.0015}
        gridScale={0.11}
        scanDirection="pingpong"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      <CRTOverlay />

      {/* desktop icons */}
      <div
        className="absolute left-0 top-0 grid auto-cols-[84px] grid-flow-col gap-1 p-2.5"
        style={{
          height: `calc(100% - ${TASKBAR_H}px)`,
          gridTemplateRows: "repeat(auto-fill, minmax(82px, 82px))",
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {APPS.filter((a) => a.desktop).map((app, i) => {
          const Icon = app.icon;
          const on = selected === app.id;
          return (
            <button
              key={app.id}
              onClick={() => {
                sfx.click();
                setSelected(app.id);
                if (coarse) openApp(app.id);
              }}
              onDoubleClick={() => openApp(app.id)}
              onKeyDown={(e) => e.key === "Enter" && openApp(app.id)}
              style={{ animationDelay: `${i * 70}ms` }}
              className={`interactive icon-pop group flex flex-col items-center gap-1.5 p-1.5 text-center outline-none ${
                on ? "bg-primary/15" : "hover:bg-primary/10"
              }`}
            >
              <Icon
                className={`h-8 w-8 transition-transform group-hover:scale-110 ${on ? "text-white" : "text-primary"}`}
                style={{ filter: "drop-shadow(0 0 7px hsl(var(--primary) / 0.8))" }}
              />
              <span className="font-terminal text-base leading-none text-foreground [text-shadow:0_0_6px_#000,0_0_3px_#000]">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* windows */}
      {wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          app={APP_MAP[w.appId]}
          os={os}
          focused={focusId === w.id}
          mobile={mobile}
          onFocus={() => focusId !== w.id && bringToFront(w.id)}
          onClose={() => close(w.id)}
          onMinimize={() => minimize(w.id)}
          onMaximize={() => {
            sfx.click();
            patch(w.id, { maximized: !w.maximized });
          }}
          onPatch={(p) => patch(w.id, p)}
        />
      ))}

      <Guide wins={wins} mobile={mobile} />

      {/* start menu */}
      <div ref={startRef}>
        {startOpen && (
          <div
            className="start-menu absolute left-0 z-[9000] w-64 border-2 border-primary bg-card/95 backdrop-blur"
            style={{ bottom: TASKBAR_H, boxShadow: "0 0 24px hsl(var(--primary) / 0.45)" }}
          >
            <div className="flex">
              <div className="flex w-7 items-end justify-center bg-gradient-to-t from-primary/50 to-primary/10 pb-2">
                <span className="font-pixel text-[9px] tracking-widest text-primary [writing-mode:vertical-rl] rotate-180">
                  YASHMINAL OS
                </span>
              </div>
              <ul className="flex-1 py-1">
                {APPS.map((app) => {
                  const Icon = app.icon;
                  return (
                    <li key={app.id}>
                      <button
                        onClick={() => {
                          sfx.click();
                          openApp(app.id);
                        }}
                        className="interactive flex w-full items-center gap-3 px-3 py-1.5 text-left font-terminal text-lg text-foreground hover:bg-primary hover:text-primary-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        {app.title}
                      </button>
                    </li>
                  );
                })}
                <li className="my-1 border-t-2 border-border" />
                <li>
                  <button
                    onClick={toggleTheme}
                    className="interactive flex w-full items-center gap-3 px-3 py-1.5 text-left font-terminal text-lg text-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {dark ? "Light mode" : "Dark mode"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleMute}
                    className="interactive flex w-full items-center gap-3 px-3 py-1.5 text-left font-terminal text-lg text-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    {muted ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    {muted ? "Unmute" : "Mute sound"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={onRestart}
                    className="interactive flex w-full items-center gap-3 px-3 py-1.5 text-left font-terminal text-lg text-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </button>
                </li>
                <li>
                  <button
                    onClick={onShutdown}
                    className="interactive flex w-full items-center gap-3 px-3 py-1.5 text-left font-terminal text-lg text-foreground hover:bg-destructive hover:text-white"
                  >
                    <Power className="h-4 w-4" />
                    Shut down
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* taskbar */}
        <div
          className="absolute inset-x-0 bottom-0 z-[9001] flex items-center gap-2 border-t-2 border-primary/80 bg-card/95 px-1.5 backdrop-blur"
          style={{ height: TASKBAR_H, boxShadow: "0 -4px 18px hsl(var(--primary) / 0.25)" }}
        >
          <button
            onClick={() => {
              sfx.click();
              setStartOpen((s) => !s);
            }}
            className={`interactive flex h-8 shrink-0 items-center gap-2 border-2 px-3 font-pixel text-[10px] tracking-widest text-primary ${
              startOpen ? "border-primary bg-primary/25" : "border-primary/70 bg-primary/10 hover:bg-primary/20"
            }`}
            style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.5)" }}
          >
            <span className="inline-block h-3 w-3 bg-primary" style={{ boxShadow: "0 0 8px hsl(var(--primary))" }} />
            START
          </button>

          <div className="mx-1 h-6 w-px bg-border" />

          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
            {wins
              .filter((w) => !w.closing)
              .map((w) => {
                const app = APP_MAP[w.appId];
                const Icon = app.icon;
                const active = focusId === w.id && !w.minimized;
                return (
                  <button
                    key={w.id}
                    onClick={() => onTaskClick(w)}
                    className={`interactive flex h-8 w-9 shrink-0 items-center gap-2 border-2 px-2 font-terminal text-base sm:w-40 ${
                      active
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/70 text-muted-foreground hover:border-primary/60"
                    } ${w.minimized ? "opacity-60" : ""}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden truncate sm:inline">{app.title}</span>
                  </button>
                );
              })}
          </div>

          <div className="flex shrink-0 items-center gap-2.5 border-l-2 border-border pl-2.5 pr-1.5">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="interactive text-muted-foreground hover:text-primary"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
