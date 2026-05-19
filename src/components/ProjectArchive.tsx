import { useState } from "react";
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
    websiteUrl: "https://pixel-perfect-vision-cuemath-flashc-opal.vercel.app/"
  },
  {
    id: "PROJ_02",
    name: "3 AM PROGRESS TRACKER",
    status: "STABLE",
    techStack: ["React", "Firebase", "PWA"],
    description: "A minimalist, dark-mode journal and expense tracking application.",
    details: "Focuses on clean UI, budget management, and secure offline-capable data synchronization across devices.",
    githubUrl: "https://github.com/Yashftw/3am",
    websiteUrl: "https://3am-seven.vercel.app/"
  },
  {
    id: "PROJ_03",
    name: "HELP ME FIX IT",
    status: "STABLE",
    techStack: ["React", "Node.js", "WebRTC"],
    description: "Real-time collaborative troubleshooting platform.",
    details: "Allows users to connect and resolve hardware/software issues via live communication tools.",
    githubUrl: "https://github.com/Yashftw/Helpmefixit-production",
    websiteUrl: "https://helpmefixit-production.vercel.app/"
  },
  {
    id: "PROJ_04",
    name: "FACE AUTHENTICATION SYSTEM",
    status: "OPERATIONAL",
    techStack: ["Python", "OpenCV", "Machine Learning"],
    description: "An AI-powered attendance system using facial recognition.",
    details: "Automates attendance tracking with high accuracy face detection and matching models.",
    githubUrl: "https://github.com/Yashftw/face-authentication-attendance-system"
  },
  {
    id: "PROJ_05",
    name: "MULTI CLOUD COST DASHBOARD",
    status: "WORK IN PROGRESS",
    techStack: ["Azure", "AWS", "GCP", "React", "Node.js"],
    description: "Cost visibility dashboard aggregating spend across Azure/AWS/GCP with anomaly signals.",
    details: "Architecture: REST-based aggregation service + dashboard UI; structured data pipeline for cross-cloud normalization and monthly trend analysis."
  }
];

const statusColor: Record<string, string> = {
  STABLE: "text-crimson-glow",
  OPERATIONAL: "text-primary",
  "WORK IN PROGRESS": "text-muted-foreground",
  DEPLOYED: "text-crimson-glow",
};

const ProjectArchive = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <PanelWrapper title="PROJECT ARCHIVE">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project)}
              className="interactive text-left border border-border bg-background p-3 hover:border-primary hover:bg-accent transition-all duration-200 group"
            >
              <div className="font-pixel text-[9px] text-muted-foreground mb-1 tracking-wider">
                [ {project.id} ]
              </div>
              <div className="font-terminal text-sm text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </div>
              <div className="font-terminal text-xs mt-1">
                STATUS: <span className={statusColor[project.status] || "text-foreground"}>{project.status}</span>
              </div>
            </button>
          ))}
        </div>
      </PanelWrapper>

      {/* Popup modal */}
      {selected && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80">
          <div className="flicker-in border-2 border-border bg-card max-w-lg w-full mx-4 panel-glow">
            <div className="absolute inset-[3px] border border-border/30 pointer-events-none" />

            <div className="bg-accent border-b-2 border-border px-4 py-2 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-primary tracking-wider">
                {selected.id} — DETAILS
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-primary text-sm interactive"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">PROJECT NAME</div>
                <div className="font-terminal text-lg text-primary">{selected.name}</div>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">DESCRIPTION</div>
                <div className="font-terminal text-sm text-foreground">{selected.description}</div>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-muted-foreground tracking-wider mb-1">TECH STACK</div>
                <div className="flex flex-wrap gap-2">
                  {selected.techStack.map((tech) => (
                    <span key={tech} className="border border-border bg-accent px-2 py-0.5 font-terminal text-xs text-foreground">
                      {tech}
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
                      className="interactive border border-border bg-background px-3 py-1.5 text-xs font-terminal text-foreground hover:border-primary hover:text-primary transition-all group"
                    >
                      [ <span className="group-hover:text-primary">GITHUB</span> ]
                    </a>
                  )}
                  {selected.websiteUrl && (
                    <a
                      href={selected.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive border border-border bg-background px-3 py-1.5 text-xs font-terminal text-foreground hover:border-primary hover:text-primary transition-all group"
                    >
                      [ <span className="group-hover:text-primary">LIVE SITE</span> ]
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectArchive;
