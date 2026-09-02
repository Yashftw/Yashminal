import { useState, useRef, useEffect } from "react";

interface TerminalLine {
  type: "input" | "output" | "art";
  text: string;
}

const DRAGON_ART = String.raw`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⠤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣿⠿⠋⠂⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣶⣿⣿⡿⢟⠫⠑⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢴⣿⣿⣿⡿⡫⠑⠊⢁⣀⣀⣀⣀⣠⡤⠖
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣄⣀⣠⣾⢟⣛⣿⡷⠴⣾⣿⣿⣿⣿⡛⠏⠁⠀⠀⠀⢀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠿⣿⡿⠑⢀⣛⣉⣁⣈⡊⠉⠉⠉⠀⠀⣀⠀⠀⠀⣿⣿⣿⣿⣶⣶⣶⠶⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣀⣠⡿⠃⢀⣿⣷⣾⣥⡄⠈⢹⣿⣿⣿⣿⣿⠿⠛⠁⣼⣿⣿⡿⡫⠽⠛⠛⠛⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⢿⣟⠁⣀⣼⣿⣿⣿⡿⠁⢀⣾⣿⣦⣍⠉⢉⣠⣴⣾⡟⢣⠰⣷⠀⠀⠀⣀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣴⣤⣤⣴⠾⠻⠟⠉⠑⠒⠉⣁⣠⣴⣿⣿⡋⠝⡻⢷⣄⡈⠛⠛⠁⠒⢲⡌⣷⣶⣶⣿⣿⣿⣷⣤⡀⠀
⠀⠀⣾⣄⣀⣠⣾⣿⣿⣿⠏⠠⠒⠒⣲⣿⣿⠿⠿⣿⣿⣿⡿⢿⣆⠀⠁⠋⠉⠉⢀⣴⣦⡉⠁⣟⢩⡻⣿⠍⠛⠭⢛⠿⢶⣤⣤⠄⠀
⠀⠘⠻⣏⠉⢉⣿⡿⡫⠛⢃⣠⣶⣾⣿⣏⠂⠉⠉⠑⢽⣿⡌⠁⢸⠀⣿⣿⣿⣿⣿⣿⣿⣿⣷⢀⣼⡀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀
⠀⠀⠀⣼⣿⡿⢧⠈⢡⡴⠊⠙⠉⠉⠉⠉⠁⠀⠀⠀⠈⣿⣷⠀⠀⠀⠉⢙⣿⣿⡯⠂⣾⣷⡐⠸⠟⣧⣄⣀⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠀⠚⢻⠧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠋⠀⠀⢀⠀⠀⣍⠉⢀⣼⣿⣿⣷⣦⣠⡿⢛⣻⡿⢿⣷⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠎⠀⠀⠸⣿⠿⡋⢉⣿⣿⣿⣿⡇⠀⠀⠀⠉⠪⢛⢧⣀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣤⣄⣠⠆⣴⣿⣿⣶⣶⣶⣶⡤⠀⠀⠀⣴⣿⡏⠀⠀⠀⢰⡈⢁⣴⣿⣿⣿⣿⣿⣿⣦⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⡿⠛⠁⣰⢟⣛⡻⣿⣿⣿⣿⡀⠀⠀⣼⣿⡿⠀⠀⠀⠀⠘⠟⠛⢻⡣⠰⣼⣿⠕⠉⠈⢻⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⣦⣶⡏⠀⣴⣾⡃⠀⠀⠈⣸⠿⡿⢿⣷⠀⠰⠛⣿⣧⠀⠀⠀⣰⣧⡤⢴⡿⠁⢀⡌⠁⢠⡄⠀⠈⠙⢿⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣧⠀⠙⢿⡇⠀⠤⢼⣿⠊⠉⣼⣿⠀⠀⢰⣿⣿⣷⣶⣿⣿⣿⠁⠈⠀⢠⣿⡿⢢⣿⣷⣤⡄⠀⠀⠉⠂⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠁⠀⠈⠡⠀⠀⠀⠀⢀⣼⣿⡏⠀⠀⣿⣿⣿⣿⣿⡿⢿⡇⠀⣷⡾⠟⢛⡇⢸⣿⣿⣿⡅⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⠀⠀⢹⣿⣿⣿⣯⠊⠉⠁⠀⣿⠁⠀⠀⠀⢸⠊⢀⣿⣷⣾⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠿⡿⢿⣿⣿⣆⠀⠱⣝⠿⣧⠀⠀⠀⠀⠹⡀⢠⡆⠀⠀⠀⣸⣿⢟⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠁⠈⢺⣿⣿⣿⣆⠀⠀⠁⠊⠓⠄⠀⠀⠀⠀⠸⣿⣤⣤⣾⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣿⡫⠝⠳⠦⣄⣀⡀⠀⠀⠀⠀⠀⠀⢻⣿⡟⠿⠿⠿⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠚⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⠀`;

const CrimsonTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: "YASHMINAL v1.0" },
    { type: "output", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [popup, setPopup] = useState<{ title: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (expanded) scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines, expanded]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const scheduleAutoClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setExpanded(false), 3200);
  };

  const processCommand = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    const newLines: TerminalLine[] = [{ type: "input", text: `> ${cmd}` }];
    setExpanded(true);
    scheduleAutoClose();

    switch (lower) {
      case "help":
        newLines.push({
          type: "output",
          text: "COMMANDS: help | about | projects | skills | contact | dragon | clear",
        });
        break;
      case "about":
        newLines.push({ type: "output", text: "▸ Scrolling to BIO..." });
        document.getElementById("bio-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "projects":
        newLines.push({ type: "output", text: "▸ Scrolling to PROJECT ARCHIVE..." });
        document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "skills":
        newLines.push({ type: "output", text: "▸ Scrolling to SKILL DIAGNOSTICS..." });
        document.getElementById("skills-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "contact":
        newLines.push({ type: "output", text: "▸ Scrolling to TRANSMISSION TERMINAL..." });
        document.getElementById("transmission-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "dragon":
        newLines.push({ type: "output", text: "▸ SUMMONING GUARDIAN PROCESS..." });
        newLines.push({ type: "art", text: DRAGON_ART });
        break;
      case "clear":
        setLines([{ type: "output", text: "YASHMINAL v1.0" }]);
        setInput("");
        return;
      case "whatabtme":
        setPopup({
          title: "ENTITY SCAN",
          content: "One good looking fella.",
        });
        newLines.push({ type: "output", text: "▸ SCANNING ENTITY..." });
        break;
      case "yashftw":
        setPopup({
          title: "ARCHIVE RECORD",
          content:
            "NAME: YASHRAJ YADAV\nALIAS: YASHFTW\nCLASSIFICATION: CLOUD ENGINEER IN TRAINING\nSTATUS: ACTIVE AND GROWING",
        });
        newLines.push({ type: "output", text: "▸ ACCESSING ARCHIVE RECORD..." });
        break;
      default:
        newLines.push({ type: "output", text: `Unknown command: "${cmd}"` });
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput("");
  };

  return (
    <>
      {/* Sticky command console footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[1400px] pointer-events-auto">
          <div className="hud-top hud-glow">
          <div className="hud-top-body bg-card/95 dark:glass-panel">
            {/* Scrollback */}
            {expanded && (
              <div
                ref={scrollRef}
                className="h-44 sm:h-52 overflow-y-auto font-terminal text-sm space-y-1 px-4 py-3 border-b border-border"
              >
                {lines.map((line, i) =>
                  line.type === "art" ? (
                    <pre
                      key={i}
                      className="text-primary/90 text-[9px] sm:text-[11px] leading-[1.05] tracking-tight overflow-x-auto whitespace-pre"
                    >
                      {line.text}
                    </pre>
                  ) : (
                    <div key={i} className={line.type === "input" ? "text-primary" : "text-foreground"}>
                      {line.text}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5">
              <button
                onClick={() => setExpanded((e) => !e)}
                aria-label={expanded ? "Collapse terminal" : "Expand terminal"}
                className="interactive lift-hover shrink-0 font-pixel text-[9px] text-muted-foreground hover:text-primary tracking-wider px-1"
              >
                {expanded ? "▾" : "▸"}
              </button>
              <span className="font-pixel text-[9px] text-primary tracking-wider hidden sm:inline shrink-0">
                YASHMINAL
              </span>
              <span className="font-terminal text-sm text-primary shrink-0">▸</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setExpanded(true)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && processCommand(input)}
                placeholder="Enter command... (try 'dragon')"
                className="flex-1 min-w-0 bg-transparent font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="hidden sm:inline font-terminal text-xs text-muted-foreground shrink-0">
                SIGNAL: <span className="text-primary status-dot inline-block">●</span>
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Retro popup window for easter eggs */}
      {popup && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm scroll-fade-in">
          <div
            className="modal-pop-in hud-frame hud-glow max-w-sm w-full mx-4"
            style={{ ["--hud-line" as string]: "var(--primary)" }}
          >
          <div className="hud-frame-body bg-card dark:glass-panel">
            <div className="bg-gradient-to-r from-accent to-accent/70 border-b-2 border-border px-4 py-2 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-primary tracking-wider">
                {popup.title}
              </span>
              <button
                onClick={() => setPopup(null)}
                className="interactive lift-hover rounded-full w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-background text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              {/* Pixel character */}
              <div className="text-center mb-4">
                <div className="font-terminal text-4xl text-primary creature-idle">
                  ◉‿◉
                </div>
                <div className="text-xs text-muted-foreground font-pixel tracking-wider mt-1">
                  *click click*
                </div>
              </div>
              <div className="font-terminal text-sm text-foreground whitespace-pre-line text-center">
                {popup.content}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrimsonTerminal;
