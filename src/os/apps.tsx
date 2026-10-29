import { useCallback, useEffect, useRef } from "react";
import {
  Activity,
  FileText,
  FolderGit2,
  Link2,
  Mail,
  Music,
  Skull,
  Target,
  SquareTerminal,
  User,
  Wrench,
} from "lucide-react";
import BioPanel from "@/components/BioPanel";
import ProjectArchive from "@/components/ProjectArchive";
import SkillMatrix from "@/components/SkillMatrix";
import CapabilityMatrix from "@/components/CapabilityMatrix";
import ContactPanel from "@/components/ContactPanel";
import ExternalLinkDialog from "@/components/ExternalLinkDialog";
import MusicPlayer from "@/components/MusicPlayer";
import PanelWrapper from "@/components/PanelWrapper";
import Terminal from "./Terminal";
import type { AppDef, OSApi } from "./types";

export const channels = [
  { label: "GITHUB", sub: "SOURCE REPOSITORY", href: "https://github.com/Yashftw", accent: "210 12% 72%", icon: "⑂" },
  {
    label: "LINKEDIN",
    sub: "PROFESSIONAL NETWORK",
    href: "https://www.linkedin.com/in/yashrajyadav20055/",
    accent: "205 90% 58%",
    icon: "▤",
  },
  { label: "RESUME", sub: "ENCRYPTED DOSSIER", href: "/Yashraj-Yadav-Resume.pdf", accent: "38 95% 58%", icon: "▦" },
];

const systemStatuses = [
  { name: "CLOUD", status: "ACTIVE", level: 92 },
  { name: "AI / ML", status: "LEARNING", level: 54 },
  { name: "SAP / ERP", status: "COMPLETED", level: 100 },
];
const activeStatuses = ["ACTIVE", "COMPLETED"];

const StatusApp = () => (
  <PanelWrapper title="SYSTEM STATUS" icon="◈">
    <div className="ascii-rule text-[10px] mb-3">
      <span>DIAGNOSTICS</span>
    </div>
    <div className="space-y-4">
      {systemStatuses.map((item, i) => (
        <div key={item.name} className="stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-terminal text-lg text-foreground">{item.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-terminal text-sm ${
                  activeStatuses.includes(item.status) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.status}
              </span>
              {activeStatuses.includes(item.status) && (
                <span className="inline-block w-2 h-2 rounded-full bg-primary status-dot" />
              )}
            </div>
          </div>
          <div className="h-1.5 bg-background border border-border/60 overflow-hidden">
            <div
              className="h-full bg-primary bar-fill"
              style={{ ["--bar-width" as string]: `${item.level}%`, width: `${item.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </PanelWrapper>
);

const LinksApp = () => (
  <PanelWrapper title="TRANSMISSION" icon="▣">
    <div className="font-terminal text-base space-y-3">
      <div className="text-muted-foreground">▸ OUTBOUND CHANNELS:</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {channels.map((ch) => (
          <ExternalLinkDialog key={ch.label} href={ch.href}>
            <div
              className="lift-hover hud-box hud-glow hover-shimmer group"
              style={{
                ["--hud-fill" as string]: "hsl(var(--background))",
                ["--hud-line" as string]: `${ch.accent} / 0.5`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.setProperty("--hud-line", ch.accent)}
              onMouseLeave={(e) => e.currentTarget.style.setProperty("--hud-line", `${ch.accent} / 0.5`)}
            >
              <div className="relative p-3 text-center">
                <span
                  className="absolute top-1 right-1.5 font-terminal text-[13px] leading-none transition-transform duration-300 group-hover:scale-125"
                  style={{ color: `hsl(${ch.accent})` }}
                >
                  {ch.icon}
                </span>
                <div className="font-pixel text-[10px] tracking-wider" style={{ color: `hsl(${ch.accent})` }}>
                  {ch.label}
                </div>
                <div className="text-xs text-foreground mt-1">{ch.sub}</div>
              </div>
            </div>
          </ExternalLinkDialog>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
        <span className="blink-cursor">AWAITING TRANSMISSION INPUT</span>
      </div>
    </div>
  </PanelWrapper>
);

const ResumeApp = () => (
  <div className="flex h-full flex-col">
    <iframe title="Resume" src="/Yashraj-Yadav-Resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH" className="min-h-0 flex-1 bg-white" />
    <a
      href="/Yashraj-Yadav-Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="interactive shrink-0 border-t-2 border-border px-3 py-2 text-center font-pixel text-[9px] tracking-widest text-primary hover:bg-accent"
    >
      OPEN IN NEW TAB ▸
    </a>
  </div>
);

const MusicApp = () => (
  <div className="flex flex-col items-center gap-4 p-6 text-center">
    <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="w-2 bg-primary eq-bar"
          style={{ animationDelay: `${i * 0.13}s`, boxShadow: "0 0 8px hsl(var(--primary))" }}
        />
      ))}
    </div>
    <MusicPlayer />
    <p className="font-terminal text-base text-muted-foreground">Ambient loop. Keep this window open to keep it playing.</p>
  </div>
);

/* The original 1993 DOOM source (linuxdoom 1.10) compiled to WebAssembly, see doom-build/. */
const DoomApp = ({ os }: { os: OSApi }) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const sendMute = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "mute", muted: os.muted }, "*");
  }, [os.muted]);
  useEffect(sendMute, [sendMute]);
  return (
    <iframe
      ref={frame}
      title="DOOM"
      src="/doom/index.html"
      onLoad={sendMute}
      allow="autoplay"
      className="h-full w-full border-0 bg-black"
    />
  );
};

/* Registry order = start-menu order = desktop icon order. */
export const APPS: AppDef[] = [
  { id: "about", title: "About.exe", icon: User, w: 600, desktop: true, render: () => <BioPanel /> },
  { id: "projects", title: "Projects.exe", icon: FolderGit2, w: 800, desktop: true, render: () => <ProjectArchive /> },
  { id: "skills", title: "Skills.exe", icon: Wrench, w: 660, desktop: true, render: () => <SkillMatrix /> },
  { id: "objectives", title: "Objectives.exe", icon: Target, w: 560, desktop: true, render: () => <CapabilityMatrix /> },
  { id: "contact", title: "Contact.exe", icon: Mail, w: 460, desktop: true, render: () => <ContactPanel /> },
  { id: "links", title: "Links.exe", icon: Link2, w: 540, desktop: true, render: () => <LinksApp /> },
  { id: "resume", title: "Resume.pdf", icon: FileText, w: 900, h: 560, fixedH: true, openMaximized: true, desktop: true, render: () => <ResumeApp /> },
  { id: "status", title: "SysMon.exe", icon: Activity, w: 440, desktop: true, render: () => <StatusApp /> },
  { id: "music", title: "Ambient.mp3", icon: Music, w: 360, desktop: true, render: () => <MusicApp /> },
  { id: "doom", title: "DOOM.exe", icon: Skull, w: 780, h: 620, fixedH: true, desktop: true, render: (os) => <DoomApp os={os} /> },
  { id: "terminal", title: "Terminal", icon: SquareTerminal, w: 600, h: 380, fixedH: true, desktop: true, render: (os) => <Terminal os={os} /> },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a]));
