import { useState, useRef, useEffect } from "react";
import PanelWrapper from "./PanelWrapper";

interface TerminalLine {
  type: "input" | "output";
  text: string;
}

const CrimsonTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: "YASHMINAL v1.0" },
    { type: "output", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [popup, setPopup] = useState<{ title: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const processCommand = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    const newLines: TerminalLine[] = [{ type: "input", text: `> ${cmd}` }];

    switch (lower) {
      case "help":
        newLines.push({
          type: "output",
          text: "COMMANDS: help | about | projects | skills | contact | clear",
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
      <PanelWrapper title="YASHMINAL">
        <div
          ref={scrollRef}
          className="h-40 overflow-y-auto font-terminal text-sm space-y-1 mb-3 scrollbar-thin"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={line.type === "input" ? "text-primary" : "text-foreground"}
            >
              {line.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-border pt-2">
          <span className="font-terminal text-sm text-primary">▸</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input.trim() && processCommand(input)}
            placeholder="Enter command..."
            className="flex-1 bg-transparent font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </PanelWrapper>

      {/* Retro popup window for easter eggs */}
      {popup && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70">
          <div className="flicker-in border-2 border-primary bg-card max-w-sm w-full mx-4 panel-glow">
            <div className="bg-accent border-b-2 border-border px-4 py-2 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-primary tracking-wider">
                {popup.title}
              </span>
              <button
                onClick={() => setPopup(null)}
                className="text-muted-foreground hover:text-primary text-sm interactive"
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
      )}
    </>
  );
};

export default CrimsonTerminal;
