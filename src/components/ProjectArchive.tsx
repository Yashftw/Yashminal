import { useEffect, useState } from "react";
import PanelWrapper from "./PanelWrapper";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  techStack: string[];
  details: string;
  githubUrl?: string;
  websiteUrl?: string;
  accent: string; // HSL triplet, e.g. "270 85% 60%"
  icon: string;
  sysLabel: string;
}

const projects: Project[] = [
  {
    id: "PROJ_01",
    name: "BRAIN BLOX",
    status: "STABLE",
    techStack: ["React", "TypeScript", "Tailwind", "Supabase", "Gemini AI"],
    description: "An AI-powered flashcard study platform with FSRS scheduling.",
    details: "Automated PDF-to-flashcard generation using Gemini AI, with spaced repetition scheduling for optimal learning.",
    githubUrl: "https://github.com/Yashftw/Brainblox",
    websiteUrl: "https://pixel-perfect-vision-cuemath-flashc-opal.vercel.app/",
    accent: "270 85% 65%",
    icon: "⌬",
    sysLabel: "NEURAL.SYS",
  },
  {
    id: "PROJ_02",
    name: "3 AM PROGRESS TRACKER",
    status: "STABLE",
    techStack: ["React", "Firebase", "PWA"],
    description: "A minimalist, dark-mode journal and expense tracking application.",
    details: "Focuses on clean UI, budget management, and secure offline-capable data synchronization across devices.",
    githubUrl: "https://github.com/Yashftw/3am",
    websiteUrl: "https://3am-seven.vercel.app/",
    accent: "245 75% 68%",
    icon: "☾",
    sysLabel: "NOCTURNE.SYS",
  },
  {
    id: "PROJ_03",
    name: "HELP ME FIX IT",
    status: "STABLE",
    techStack: ["React", "Node.js", "WebRTC"],
    description: "Real-time collaborative troubleshooting platform.",
    details: "Allows users to connect and resolve hardware/software issues via live communication tools.",
    githubUrl: "https://github.com/Yashftw/Helpmefixit-production",
    websiteUrl: "https://helpmefixit-production.vercel.app/",
    accent: "35 92% 58%",
    icon: "⚙",
    sysLabel: "REPAIR.SYS",
  },
  {
    id: "PROJ_04",
    name: "FACE AUTHENTICATION SYSTEM",
    status: "OPERATIONAL",
    techStack: ["Python", "OpenCV", "Machine Learning"],
    description: "An AI-powered attendance system using facial recognition.",
    details: "Automates attendance tracking with high accuracy face detection and matching models.",
    githubUrl: "https://github.com/Yashftw/face-authentication-attendance-system",
    accent: "142 70% 48%",
    icon: "◉",
    sysLabel: "OPTIC.SYS",
  },
  {
    id: "PROJ_05",
    name: "MULTI CLOUD COST DASHBOARD",
    status: "WORK IN PROGRESS",
    techStack: ["Azure", "AWS", "GCP", "React", "Node.js"],
    description: "Cost visibility dashboard aggregating spend across Azure/AWS/GCP with anomaly signals.",
    details: "Architecture: REST-based aggregation service + dashboard UI; structured data pipeline for cross-cloud normalization and monthly trend analysis.",
    accent: "197 100% 50%",
    icon: "☁",
    sysLabel: "LEDGER.SYS",
  },
];

const statusColor: Record<string, string> = {
  STABLE: "text-crimson-glow",
  OPERATIONAL: "text-primary",
  "WORK IN PROGRESS": "text-muted-foreground",
  DEPLOYED: "text-crimson-glow",
};

const ProjectArchive = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [accessing, setAccessing] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const openProject = (project: Project) => {
    setAccessing(project);
    setSelected(null);
    setTimeout(() => {
      setAccessing(null);
      setSelected(project);
    }, 650);
  };

  useEffect(() => {
    if (!selected && !accessing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setAccessing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, accessing]);

  return (
    <>
      <PanelWrapper title="PROJECT ARCHIVE" icon="◆">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <button
              key={project.id}
              onClick={() => openProject(project)}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              className="interactive lift-hover hud-box hud-glow text-left group stagger-item w-full"
              style={{
                animationDelay: `${i * 70}ms`,
                ["--hud-fill" as string]: "hsl(var(--background))",
                ["--hud-line" as string]:
                  hovered === project.id ? `${project.accent}` : "var(--border)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-[1px] transition-opacity duration-300 z-[1]"
                style={{
                  background: `radial-gradient(circle at 15% 0%, hsl(${project.accent} / 0.16), transparent 60%)`,
                  opacity: hovered === project.id ? 1 : 0,
                }}
              />

              <div className="relative z-[2] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-[9px] text-muted-foreground tracking-wider">
                    [ {project.id} ]
                  </span>
                  <span
                    className="font-terminal text-lg leading-none"
                    style={{ color: `hsl(${project.accent})` }}
                  >
                    {project.icon}
                  </span>
                </div>
                <div className="font-terminal text-base text-foreground">
                  {project.name}
                </div>
                <div
                  className="font-pixel text-[7px] tracking-widest mt-1.5 opacity-70"
                  style={{ color: `hsl(${project.accent})` }}
                >
                  {project.sysLabel}
                </div>
                <div className="font-terminal text-xs mt-2">
                  STATUS: <span className={statusColor[project.status] || "text-foreground"}>{project.status}</span>
                </div>

                {/* Description unfurls on hover */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                  style={{
                    gridTemplateRows: hovered === project.id ? "1fr" : "0fr",
                    opacity: hovered === project.id ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className="mt-2.5 pt-2.5 border-t font-terminal text-xs text-muted-foreground"
                      style={{ borderColor: `hsl(${project.accent} / 0.35)` }}
                    >
                      {project.description}
                      <div
                        className="font-pixel text-[7px] tracking-widest mt-2 blink-cursor"
                        style={{ color: `hsl(${project.accent})` }}
                      >
                        CLICK TO OPEN FILE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PanelWrapper>

      {/* Accessing file loading state */}
      {accessing && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm scroll-fade-in">
          <div
            className="modal-pop-in hud-frame hud-glow max-w-sm w-full mx-4"
            style={{ ["--hud-line" as string]: `${accessing.accent}` }}
          >
            <div className="hud-frame-body bg-card dark:glass-panel p-6">
              <div className="font-pixel text-[9px] tracking-wider mb-3" style={{ color: `hsl(${accessing.accent})` }}>
                ACCESSING FILE [{accessing.id}]…
              </div>
              <div className="h-2 bg-background border border-border overflow-hidden">
                <div
                  className="h-full retro-load-bar"
                  style={{ background: `hsl(${accessing.accent})`, animationDuration: "0.6s" }}
                />
              </div>
              <div className="mt-3 font-terminal text-xs text-muted-foreground blink-cursor">
                DECRYPTING RECORD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm scroll-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-pop-in hud-frame hud-glow max-w-lg w-full mx-4"
            style={{ ["--hud-line" as string]: `${selected.accent}` }}
          >
          <div className="hud-frame-body bg-card dark:glass-panel">
            <div
              className="border-b-2 border-border px-4 py-2 flex items-center justify-between"
              style={{ background: `linear-gradient(90deg, hsl(${selected.accent} / 0.18), transparent)` }}
            >
              <span className="font-pixel text-[10px] tracking-wider flex items-center gap-2" style={{ color: `hsl(${selected.accent})` }}>
                <span className="text-base leading-none">{selected.icon}</span>
                {selected.id} — DETAILS
              </span>
              <button
                onClick={() => setSelected(null)}
                className="interactive lift-hover w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">
                  PROJECT NAME · <span style={{ color: `hsl(${selected.accent})` }}>{selected.sysLabel}</span>
                </div>
                <div className="font-terminal text-lg" style={{ color: `hsl(${selected.accent})` }}>
                  {selected.name}
                </div>
              </div>

              <div className="ascii-rule text-[9px]" />

              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">DESCRIPTION</div>
                <div className="font-terminal text-sm text-foreground">{selected.description}</div>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">TECH STACK</div>
                <div className="flex flex-wrap gap-2">
                  {selected.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="hud-box inline-block"
                      style={{
                        ["--cut" as string]: "5px",
                        ["--hud-fill" as string]: "hsl(var(--accent))",
                        ["--hud-line" as string]: `${selected.accent} / 0.55`,
                      }}
                    >
                      <span className="block px-2 py-0.5 font-terminal text-xs text-foreground">{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">ARCHITECTURE</div>
                <div className="font-terminal text-sm text-muted-foreground">{selected.details}</div>
              </div>

              {(selected.githubUrl || selected.websiteUrl) && (
                <div className="flex flex-wrap gap-4 pt-2 border-t border-border mt-4">
                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive lift-hover hud-box hud-glow"
                      style={{ ["--hud-line" as string]: `${selected.accent} / 0.6` }}
                    >
                      <span className="block px-3 py-1.5 text-xs font-terminal text-foreground hover:text-primary transition-colors">
                        [ GITHUB ]
                      </span>
                    </a>
                  )}
                  {selected.websiteUrl && (
                    <a
                      href={selected.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive lift-hover hud-box hud-glow"
                      style={{ ["--hud-line" as string]: `${selected.accent} / 0.6` }}
                    >
                      <span className="block px-3 py-1.5 text-xs font-terminal text-foreground hover:text-primary transition-colors">
                        [ LIVE SITE ]
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectArchive;
