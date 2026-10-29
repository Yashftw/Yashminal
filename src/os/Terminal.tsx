import { useEffect, useRef, useState } from "react";
import { DRAGON_ART } from "@/components/CrimsonTerminal";
import { sfx } from "./sound";
import type { OSApi } from "./types";

interface Line {
  kind: "in" | "out" | "art" | "dim";
  text: string;
}

/* command -> app it opens */
const OPENERS: Record<string, string> = {
  about: "about",
  projects: "projects",
  skills: "skills",
  objectives: "objectives",
  contact: "contact",
  links: "links",
  resume: "resume",
  status: "status",
  music: "music",
  doom: "doom",
};

const HELP = [
  "COMMANDS",
  "  about | projects | skills | objectives   open that app",
  "  contact | links | resume | status | music | doom",
  "  open <app>      open any app by name",
  "  ls              list installed apps",
  "  whoami          who is this guy",
  "  neofetch        system info",
  "  theme           toggle dark / light",
  "  mute | unmute   toggle sound",
  "  dragon          summon the guardian process",
  "  clear           wipe the screen",
  "  reboot | shutdown",
];

const Terminal = ({ os }: { os: OSApi }) => {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "YASHMINAL OS [Version 1.0.26]" },
    { kind: "dim", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const [name, ...rest] = cmd.toLowerCase().split(/\s+/);
    const out: Line[] = [{ kind: "in", text: `C:\\YASH> ${cmd}` }];
    const say = (...t: string[]) => t.forEach((text) => out.push({ kind: "out", text }));

    if (!cmd) {
      setLines((p) => [...p, ...out]);
      return;
    }

    if (name === "clear" || name === "cls") {
      setLines([]);
      return;
    }

    if (name === "help" || name === "?") say(...HELP);
    else if (OPENERS[name]) {
      say(`▸ launching ${OPENERS[name]}...`);
      os.openApp(OPENERS[name]);
    } else if (name === "open" || name === "start") {
      const target = OPENERS[rest[0]] ?? (rest[0] === "terminal" ? "terminal" : undefined);
      if (target) {
        say(`▸ launching ${target}...`);
        os.openApp(target);
      } else say(`open: no such app "${rest[0] ?? ""}". Try "ls".`);
    } else if (name === "ls" || name === "dir")
      say(...Object.keys(OPENERS).map((k) => `  ${k}.exe`), "  terminal.exe");
    else if (name === "whoami") say("yashraj yadav (yashftw) — cloud engineer in training");
    else if (name === "yashftw")
      say("NAME: YASHRAJ YADAV", "ALIAS: YASHFTW", "CLASS: CLOUD ENGINEER IN TRAINING", "STATUS: ACTIVE AND GROWING");
    else if (name === "whatabtme") say("One good looking fella.");
    else if (name === "neofetch")
      say(
        "OS      : YASHMINAL OS 1.0 (neon edition)",
        "HOST    : portfolio.hdd",
        "SHELL   : yash-sh",
        `THEME   : ${os.dark ? "dark" : "light"} / cyan neon`,
        `SOUND   : ${os.muted ? "muted" : "on"}`,
        "SIGNAL  : ● UNSTABLE",
      );
    else if (name === "theme") {
      os.toggleTheme();
      say(`▸ theme set to ${os.dark ? "light" : "dark"}`);
    } else if (name === "mute" || name === "unmute") {
      if ((name === "mute") !== os.muted) os.toggleMute();
      say(name === "mute" ? "▸ sound muted" : "▸ sound on");
    } else if (name === "dragon") {
      say("▸ SUMMONING GUARDIAN PROCESS...");
      out.push({ kind: "art", text: DRAGON_ART });
    } else if (name === "date") say(new Date().toString());
    else if (name === "echo") say(rest.join(" "));
    else if (name === "sudo") say("nice try. you are not in the sudoers file. this incident will be reported.");
    else if (name === "reboot" || name === "restart") {
      say("▸ rebooting...");
      setLines((p) => [...p, ...out]);
      window.setTimeout(os.restart, 500);
      return;
    } else if (name === "shutdown" || name === "exit") {
      say("▸ shutting down...");
      setLines((p) => [...p, ...out]);
      window.setTimeout(os.shutdown, 500);
      return;
    } else out.push({ kind: "dim", text: `'${name}' is not recognized. Type "help".` });

    setLines((p) => [...p, ...out]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sfx.click();
      if (input.trim()) history.current.unshift(input);
      hIdx.current = -1;
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIdx.current < history.current.length - 1) setInput(history.current[++hIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hIdx.current = Math.max(-1, hIdx.current - 1);
      setInput(hIdx.current === -1 ? "" : history.current[hIdx.current]);
    }
  };

  return (
    <div
      className="h-full overflow-y-auto bg-black/80 p-3 font-terminal text-lg leading-tight"
      ref={scroller}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) =>
        l.kind === "art" ? (
          <pre key={i} className="text-primary/90 text-[9px] sm:text-[11px] leading-[1.05] tracking-tight overflow-x-auto whitespace-pre">
            {l.text}
          </pre>
        ) : (
          <div
            key={i}
            className={`whitespace-pre-wrap break-words ${
              l.kind === "in" ? "text-primary" : l.kind === "dim" ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {l.text}
          </div>
        ),
      )}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-primary">C:\YASH&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-foreground caret-primary focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Terminal;
