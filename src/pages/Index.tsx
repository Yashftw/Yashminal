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

const systemStatuses = [
  { name: "CLOUD", status: "ACTIVE" },
  { name: "AI / ML", status: "LEARNING" },
  { name: "SAP / ERP", status: "COMPLETED" },
];

const activeStatuses = ["ACTIVE", "COMPLETED"];

type Phase = "boot" | "dashboard";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("boot");
  const [scrollUnlocked, setScrollUnlocked] = useState(true);

  // Force dark mode on initial load
  useEffect(() => {
    const stored = localStorage.getItem("crimson-theme");
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

      <div id="main-dashboard" className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-5 pt-20">

        {/* GREET ICON */}
        {!scrollUnlocked && (
          <GreetIcon onUnlock={() => setScrollUnlocked(true)} />
        )}

        {/* STATUS STRIP */}
        <ScrollReveal>
          <div className="border-2 border-border bg-accent px-4 py-2 flex items-center justify-between panel-glow">
            <span className="font-pixel text-[10px] tracking-wider text-primary">CRIMSON ARCHIVE v5.0</span>
            <div className="flex items-center gap-4">
              <span className="font-terminal text-xs text-muted-foreground">
                SIGNAL: <span className="text-primary status-dot inline-block">●</span> UNSTABLE
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* BIO */}
        <ScrollReveal delay={100}>
          <div id="bio-section">
            <BioPanel />
          </div>
        </ScrollReveal>

        {/* SYSTEM STATUS */}
        <ScrollReveal delay={150}>
          <PanelWrapper title="SYSTEM STATUS">
            <div className="space-y-3">
              {systemStatuses.map((item, i) => (
                <div
                  key={item.name}
                  className="stagger-item flex items-center justify-between border border-border bg-background px-3 py-2 hover-shimmer"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
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
              ))}
            </div>
          </PanelWrapper>
        </ScrollReveal>

        {/* PROJECT ARCHIVE */}
        <ScrollReveal delay={150}>
          <div id="projects-section">
            <ProjectArchive />
          </div>
        </ScrollReveal>

        {/* CAPABILITY MATRIX */}
        <ScrollReveal delay={150}>
          <CapabilityMatrix />
        </ScrollReveal>

        {/* SKILL DIAGNOSTICS */}
        <ScrollReveal delay={150}>
          <div id="skills-section">
            <SkillMatrix />
          </div>
        </ScrollReveal>

        {/* YASHMINAL */}
        <ScrollReveal delay={150}>
          <CrimsonTerminal />
        </ScrollReveal>

        {/* CONTACT */}
        <ScrollReveal delay={150}>
          <ContactPanel />
        </ScrollReveal>

        {/* TRANSMISSION TERMINAL */}
        <ScrollReveal delay={150}>
          <div id="transmission-section">
            <PanelWrapper title="TRANSMISSION TERMINAL">
              <div className="font-terminal text-sm space-y-2">
                <div className="text-muted-foreground">▸ OUTBOUND CHANNELS:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ExternalLinkDialog href="https://github.com/Yashftw">
                    <div className="border border-border bg-background p-3 hover:border-primary hover:bg-accent transition-all text-center group hover-shimmer">
                      <div className="font-pixel text-[10px] text-muted-foreground group-hover:text-primary tracking-wider">GITHUB</div>
                      <div className="text-xs text-foreground mt-1">SOURCE REPOSITORY</div>
                    </div>
                  </ExternalLinkDialog>
                  <ExternalLinkDialog href="https://www.linkedin.com/in/yashrajyadav20055/">
                    <div className="border border-border bg-background p-3 hover:border-primary hover:bg-accent transition-all text-center group hover-shimmer">
                      <div className="font-pixel text-[10px] text-muted-foreground group-hover:text-primary tracking-wider">LINKEDIN</div>
                      <div className="text-xs text-foreground mt-1">PROFESSIONAL NETWORK</div>
                    </div>
                  </ExternalLinkDialog>
                  <ExternalLinkDialog href="/Yashraj-Yadav-Resume.pdf">
                    <div className="border border-border bg-background p-3 hover:border-primary hover:bg-accent transition-all text-center group hover-shimmer">
                      <div className="font-pixel text-[10px] text-muted-foreground group-hover:text-primary tracking-wider">RESUME</div>
                      <div className="text-xs text-foreground mt-1">ENCRYPTED DOSSIER</div>
                    </div>
                  </ExternalLinkDialog>
                </div>
                <div className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="blink-cursor">AWAITING TRANSMISSION INPUT</span>
                </div>
              </div>
            </PanelWrapper>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <div className="text-center py-4 font-terminal text-xs text-muted-foreground border-t border-border">
          CRIMSON ARCHIVE © 2026 — YASFTW — ALL SYSTEMS MONITORED
        </div>
      </div>
    </div>
  );
};

export default Index;
