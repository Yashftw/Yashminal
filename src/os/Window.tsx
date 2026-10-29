import { useEffect, useRef, useState } from "react";
import { Minus, Square, X } from "lucide-react";
import { InWindowContext } from "@/components/PanelWrapper";
import { sfx } from "./sound";
import type { AppDef, OSApi } from "./types";

export const TASKBAR_H = 40;

export interface Win {
  id: string;
  appId: string;
  z: number;
  x: number;
  y: number;
  w: number;
  /** null = fit to content */
  h: number | null;
  minimized: boolean;
  maximized: boolean;
  closing: boolean;
}

interface Props {
  win: Win;
  app: AppDef;
  os: OSApi;
  focused: boolean;
  mobile: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onPatch: (p: Partial<Win>) => void;
}

const MIN_W = 320;
const MIN_H = 200;

const Window = ({ win, app, os, focused, mobile, onFocus, onClose, onMinimize, onMaximize, onPatch }: Props) => {
  const [fresh, setFresh] = useState(true); // glitch-in running
  const [jitter, setJitter] = useState(false);
  const wasFocused = useRef(focused);
  const full = mobile || win.maximized;

  /* open: glitch-in, then drop the animation class so no transform lingers
     (a lingering transform would trap the position:fixed modals inside). */
  useEffect(() => {
    sfx.zap();
    const t = window.setTimeout(() => setFresh(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  /* brief jitter whenever the window gains focus */
  useEffect(() => {
    if (focused && !wasFocused.current) {
      setJitter(true);
      const t = window.setTimeout(() => setJitter(false), 220);
      wasFocused.current = focused;
      return () => window.clearTimeout(t);
    }
    wasFocused.current = focused;
  }, [focused]);

  const startDrag = (e: React.PointerEvent) => {
    onFocus();
    if (full || e.button !== 0) return;
    const sx = e.clientX - win.x;
    const sy = e.clientY - win.y;
    const move = (ev: PointerEvent) => {
      const x = Math.min(Math.max(ev.clientX - sx, -win.w + 120), window.innerWidth - 80);
      const y = Math.min(Math.max(ev.clientY - sy, 0), window.innerHeight - TASKBAR_H - 32);
      onPatch({ x, y });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    onFocus();
    const sx = e.clientX;
    const sy = e.clientY;
    const { w } = win;
    const h = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().height ?? win.h ?? MIN_H;
    const move = (ev: PointerEvent) =>
      onPatch({
        w: Math.max(MIN_W, w + ev.clientX - sx),
        h: Math.max(MIN_H, h + ev.clientY - sy),
      });
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const style: React.CSSProperties = full
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)`, zIndex: win.z }
    : {
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h ?? undefined,
        maxHeight: `calc(100% - ${win.y + TASKBAR_H + 8}px)`,
        zIndex: win.z,
      };

  const Icon = app.icon;

  return (
    <div
      style={{ ...style, display: win.minimized ? "none" : undefined }}
      onPointerDown={onFocus}
      data-win={win.id}
      className={`os-window absolute flex flex-col border-2 bg-card ${
        focused ? "os-window-focus border-primary" : "border-border/70"
      } ${fresh ? "win-open" : ""} ${win.closing ? "win-close" : ""} ${jitter ? "win-jitter" : ""}`}
    >
      {/* title bar */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={() => !mobile && onMaximize()}
        className={`flex shrink-0 select-none items-center gap-2 border-b-2 border-border px-2 py-1.5 touch-none ${
          focused ? "bg-gradient-to-r from-primary/30 to-accent" : "bg-accent/60"
        } ${full ? "" : "cursor-move"}`}
      >
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 truncate font-pixel text-[10px] tracking-wider text-primary">{app.title}</span>
        {!mobile && (
          <>
            <button
              aria-label="Minimize"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onMinimize}
              className="interactive flex h-6 w-6 items-center justify-center border border-border text-muted-foreground hover:bg-primary/20 hover:text-primary"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              aria-label="Maximize"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onMaximize}
              className="interactive flex h-6 w-6 items-center justify-center border border-border text-muted-foreground hover:bg-primary/20 hover:text-primary"
            >
              <Square className="h-3 w-3" />
            </button>
          </>
        )}
        <button
          aria-label="Close"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="interactive flex h-6 w-6 items-center justify-center border border-border text-muted-foreground hover:bg-destructive/80 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* content */}
      <div className="relative min-h-0 flex-1 overflow-auto">
        <InWindowContext.Provider value={true}>{app.render(os)}</InWindowContext.Provider>
      </div>

      {!full && (
        <div
          onPointerDown={startResize}
          aria-hidden="true"
          className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-se-resize touch-none"
          style={{
            background: "linear-gradient(135deg, transparent 50%, hsl(var(--primary)) 50%, hsl(var(--primary)) 58%, transparent 58%, transparent 70%, hsl(var(--primary)) 70%, hsl(var(--primary)) 78%, transparent 78%)",
          }}
        />
      )}

      {/* RGB tear overlay while the window glitches in */}
      {fresh && <div aria-hidden="true" className="win-tear pointer-events-none absolute inset-0 z-20" />}
    </div>
  );
};

export default Window;
