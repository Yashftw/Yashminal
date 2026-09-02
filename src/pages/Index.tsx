import { useEffect, useState } from "react";
import BootScreen from "@/components/BootScreen";
import CRTOverlay from "@/components/CRTOverlay";
import PanelWrapper from "@/components/PanelWrapper";
import ProjectArchive from "@/components/ProjectArchive";
import SkillMatrix from "@/components/SkillMatrix";
import CapabilityMatrix from "@/components/CapabilityMatrix";
import ExternalLinkDialog from "@/components/ExternalLinkDialog";
import MusicPlayer from "@/components/MusicPlayer";
import { GridScan } from "@/components/GridScan";
import ScrollReveal from "@/components/ScrollReveal";
import BioPanel from "@/components/BioPanel";
import GreetIcon from "@/components/GreetIcon";
import CrimsonTerminal from "@/components/CrimsonTerminal";
import ThemeToggle from "@/components/ThemeToggle";
import ContactPanel from "@/components/ContactPanel";
import PixelBuddy from "@/components/PixelBuddy";

const channels = [
  {
    label: "GITHUB",
    sub: "SOURCE REPOSITORY",
    href: "https://github.com/Yashftw",
    accent: "210 12% 72%",
    icon: "⑂",
  },
  {
    label: "LINKEDIN",
    sub: "PROFESSIONAL NETWORK",
    href: "https://www.linkedin.com/in/yashrajyadav20055/",
    accent: "205 90% 58%",
    icon: "▤",
  },
  {
    label: "RESUME",
    sub: "ENCRYPTED DOSSIER",
    href: "/Yashraj-Yadav-Resume.pdf",
    accent: "38 95% 58%",
    icon: "▦",
  },
];

const systemStatuses = [
  { name: "CLOUD", status: "ACTIVE", level: 92 },
  { name: "AI / ML", status: "LEARNING", level: 54 },
  { name: "SAP / ERP", status: "COMPLETED", level: 100 },
];

const activeStatuses = ["ACTIVE", "COMPLETED"];

type Phase = "boot" | "dashboard";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("boot");
  const [scrollUnlocked, setScrollUnlocked] = useState(true);

  // Force dark mode on initial load
  useEffect(() => {
    const stored = localStorage.getItem("cyan-theme");
    if (!stored || stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Light scroll resistance until greet is answered
  useEffect(() => {
    if (phase !== "dashboard" || scrollUnlocked) return;
    const handleScroll = (e: WheelEvent) => {
      if (!scrollUnlocked) {
        if (window.scrollY > 200) {
          e.preventDefault();
          window.scrollTo({ top: 100, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [phase, scrollUnlocked]);

  // Random screen glitch (35-60s interval)
  useEffect(() => {
    if (phase !== "dashboard") return;
    const triggerGlitch = () => {
      const el = document.getElementById("main-dashboard");
      if (el) {
        el.classList.add("screen-glitch");
        setTimeout(() => el.classList.remove("screen-glitch"), 100);
      }
      const next = 35000 + Math.random() * 25000;
      setTimeout(triggerGlitch, next);
    };
    const timeout = setTimeout(triggerGlitch, 35000);
    return () => clearTimeout(timeout);
  }, [phase]);

  if (phase === "boot") {
    return <BootScreen onComplete={() => setPhase("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-background crt-flicker crt-screen relative">
      <GridScan
        linesColor="#0B2A3C"
        scanColor="#0BB7FF"
        scanOpacity={0.35}
        noiseIntensity={0.012}
        chromaticAberration={0.0015}
        gridScale={0.11}
        scanDirection="pingpong"
      />
      <CRTOverlay />
      {/* Top bar: Theme toggle + Music player */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <ThemeToggle />
        <MusicPlayer />
      </div>

      <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />

      <div
        id="main-dashboard"
        className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 pt-20 pb-32"
      >
        {/* GREET ICON */}
        {!scrollUnlocked && (
          <GreetIcon onUnlock={() => setScrollUnlocked(true)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* STATUS STRIP */}
          <ScrollReveal className="lg:col-span-12">
            <div
              className="hud-box hud-glow"
              style={{ ["--bw" as string]: "2px", ["--hud-fill" as string]: "hsl(var(--accent))" }}
            >
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="font-pixel text-[10px] tracking-wider text-primary">CYAN CONSOLE v5.0</span>
                <span className="font-terminal text-xs text-muted-foreground">
                  SIGNAL: <span className="text-primary status-dot inline-block">●</span> UNSTABLE
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* BIO */}
          <ScrollReveal delay={100} className="lg:col-span-7">
            <div id="bio-section" className="h-full">
              <BioPanel />
            </div>
          </ScrollReveal>

          {/* SYSTEM STATUS */}
          <ScrollReveal delay={150} className="lg:col-span-5">
            <PanelWrapper title="SYSTEM STATUS" icon="◈">
              <div className="ascii-rule text-[10px] mb-3">
                <span>DIAGNOSTICS</span>
              </div>
              <div className="space-y-4">
                {systemStatuses.map((item, i) => (
                  <div
                    key={item.name}
                    className="stagger-item"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-terminal text-sm text-foreground">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-terminal text-xs ${
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
          </ScrollReveal>

          {/* PROJECT ARCHIVE */}
          <ScrollReveal delay={150} className="lg:col-span-12">
            <div id="projects-section">
              <ProjectArchive />
            </div>
          </ScrollReveal>

          {/* CAPABILITY MATRIX */}
          <ScrollReveal delay={150} className="lg:col-span-5">
            <CapabilityMatrix />
          </ScrollReveal>

          {/* SKILL DIAGNOSTICS */}
          <ScrollReveal delay={150} className="lg:col-span-7">
            <div id="skills-section" className="h-full">
              <SkillMatrix />
            </div>
          </ScrollReveal>

          {/* CONTACT */}
          <ScrollReveal delay={150} className="lg:col-span-6">
            <ContactPanel />
          </ScrollReveal>

          {/* TRANSMISSION TERMINAL */}
          <ScrollReveal delay={150} className="lg:col-span-6">
            <div id="transmission-section" className="h-full">
              <PanelWrapper title="TRANSMISSION TERMINAL" icon="▣">
                <div className="font-terminal text-sm space-y-3">
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
                          onMouseEnter={(e) =>
                            e.currentTarget.style.setProperty("--hud-line", ch.accent)
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.setProperty("--hud-line", `${ch.accent} / 0.5`)
                          }
                        >
                          <div className="relative p-3 text-center">
                            {/* retro glyph, upper right, themed per channel */}
                            <span
                              className="absolute top-1 right-1.5 font-terminal text-[13px] leading-none transition-transform duration-300 group-hover:scale-125"
                              style={{ color: `hsl(${ch.accent})` }}
                            >
                              {ch.icon}
                            </span>
                            <div
                              className="font-pixel text-[10px] tracking-wider transition-colors"
                              style={{ color: `hsl(${ch.accent})` }}
                            >
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
            </div>
          </ScrollReveal>

          {/* Footer */}
          <div className="lg:col-span-12 text-center py-4 font-terminal text-xs text-muted-foreground border-t border-border">
            CYAN CONSOLE © 2026 — YASHFTW — ALL SYSTEMS MONITORED
          </div>
        </div>
      </div>

      {/* Roaming pixel companion */}
      <PixelBuddy />

      {/* Sticky command console footer */}
      <CrimsonTerminal />
    </div>
  );
};

export default Index;
