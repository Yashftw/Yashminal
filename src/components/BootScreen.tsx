import { useEffect, useMemo, useRef, useState } from "react";

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [done, setDone] = useState(false);
  const [rendered, setRendered] = useState<string[]>([""]);
  const [glitch, setGlitch] = useState(false);
  const [progress, setProgress] = useState(0);

  const timeoutsRef = useRef<number[]>([]);

  const bootLines = useMemo(
    () => [
    "BOOTING CYBER ARCHIVE...",
    "",
    "ENTITY: YASHFTW",
    "SIGNAL: UNSTABLE",
    "STATUS: ONLINE",
    "",
    "SYSTEM INTEGRITY... OK",
    "DECRYPTING HEADERS...",
    "ESTABLISHING CHANNEL...",
    "",
    "▸ ALL SYSTEMS NOMINAL",
    "▸ ENTERING ARCHIVE...",
    ],
    []
  );

  useEffect(() => {
    const pushTimeout = (id: number) => timeoutsRef.current.push(id);

    let lineIdx = 0;
    let charIdx = 0;

    const bootTotalChars = bootLines.reduce((acc, l) => acc + l.length, 0) || 1;
    let printedChars = 0;

    const tick = () => {
      if (lineIdx >= bootLines.length) {
        setProgress(100);
        pushTimeout(
          window.setTimeout(() => {
            setDone(true);
            pushTimeout(window.setTimeout(() => onComplete(), 650));
          }, 550)
        );
        return;
      }

      const fullLine = bootLines[lineIdx];
      const isBlank = fullLine.length === 0;

      // occasional jitter/glitch
      if (Math.random() < 0.06) {
        setGlitch(true);
        pushTimeout(window.setTimeout(() => setGlitch(false), 140));
      }

      if (isBlank) {
        setRendered((prev) => [...prev.slice(0, -1), "\u00A0", ""]);
        lineIdx += 1;
        charIdx = 0;
        pushTimeout(window.setTimeout(tick, 90));
        return;
      }

      // Type characters into the current line
      const nextChar = fullLine[charIdx] ?? "";
      const delay = nextChar === "." ? 60 : nextChar === " " ? 18 : 14;

      setRendered((prev) => {
        const out = prev.slice();
        const last = out[out.length - 1] ?? "";
        out[out.length - 1] = `${last}${nextChar}`;
        return out;
      });

      charIdx += 1;
      printedChars += 1;
      setProgress(Math.min(99, Math.round((printedChars / bootTotalChars) * 100)));

      if (charIdx >= fullLine.length) {
        // end of line -> start a new one
        setRendered((prev) => [...prev, ""]);
        lineIdx += 1;
        charIdx = 0;
        pushTimeout(window.setTimeout(tick, 140));
        return;
      }

      pushTimeout(window.setTimeout(tick, delay));
    };

    tick();

    return () => {
      for (const id of timeoutsRef.current) window.clearTimeout(id);
      timeoutsRef.current = [];
    };
  }, [bootLines, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-black flex items-center justify-center transition-opacity duration-500 ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Scanline overlay */}
      <div className="crt-overlay" />
      
      <div className="max-w-lg w-full px-6">
        <div className={`space-y-1 font-terminal text-lg ${glitch ? "boot-jitter" : ""}`}>
          {rendered.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.startsWith("ENTITY") || line.startsWith("STATUS") || line.startsWith("SIGNAL")
                  ? "text-primary font-bold"
                  : line.startsWith("▸")
                  ? "text-crimson-glow"
                  : "text-primary/80"
              }`}
            >
              {line || "\u00A0"}
            </div>
          ))}
          {!done && (
            <span className="blink-cursor text-primary font-terminal text-lg" />
          )}
        </div>

        {/* Loading bar */}
        <div className="mt-5 border border-border bg-background/40 h-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-terminal text-xs text-muted-foreground">
          <span>{progress < 100 ? "LOADING…" : "LOADED"}</span>
          <span className="text-foreground">{progress}%</span>
        </div>

        {/* Glitch tear line */}
        <div
          className="mt-6 h-[2px] bg-primary opacity-40"
          style={{
            clipPath:
              "polygon(0 0, 15% 0, 17% 100%, 35% 100%, 37% 0, 60% 0, 62% 100%, 80% 100%, 82% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default BootScreen;
