import { useState } from "react";
import PanelWrapper from "./PanelWrapper";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  techStack: string[];
  details: string;
}

const projects: Project[] = [
  {
    id: "PROTOCOL_01",
    name: "AI-BASED SENTIMENT ANALYSIS",
    status: "OPERATIONAL",
    techStack: ["Python", "NLP", "Machine Learning"],
    description: "Sentiment analysis system for classifying text across multiple languages and domains.",
    details: "Architecture: Data preprocessing + model training/inference pipeline with evaluation loops; designed for easy dataset swaps and fast iteration.",
  },
  {
    id: "PROTOCOL_02",
    name: "CHROME EXTENSION — TUBESHELF",
    status: "STABLE",
    techStack: ["JavaScript", "Chrome APIs", "HTML", "CSS"],
    description: "Chrome extension to organize and save YouTube content for later, with quick categorization.",
    details: "Architecture: Manifest V3 extension with background service worker + storage sync; lightweight UI for fast save, search, and shelf management.",
  },
  {
    id: "PROTOCOL_03",
    name: "MULTI-CLOUD COST DASHBOARD",
    status: "OPERATIONAL",
    techStack: ["Azure", "AWS", "GCP", "React", "Node.js"],
    description: "Cost visibility dashboard aggregating spend across Azure/AWS/GCP with anomaly signals.",
    details: "Architecture: REST-based aggregation service + dashboard UI; structured data pipeline for cross-cloud normalization and monthly trend analysis.",
  },
  {
    id: "PROTOCOL_04",
    name: "SERVERLESS DOCUMENT INTELLIGENCE PIPELINE",
    status: "DEPLOYED",
    techStack: ["Azure Functions", "AWS Lambda", "OCR", "NLP"],
    description: "Serverless pipeline for extracting structured data from documents using OCR + NLP.",
    details: "Architecture: Event-driven ingestion (blob/S3 triggers) → OCR/NLP extraction → structured output; built for throughput and low ops overhead.",
  },
  {
    id: "PROTOCOL_05",
    name: "OFFLINE SURVIVAL AI ASSISTANT (RAG + SMALL LLM)",
    status: "TESTING",
    techStack: ["Python", "RAG", "Vector Search", "Small LLM"],
    description: "Offline-first assistant designed for low-connectivity scenarios using retrieval-augmented generation.",
    details: "Architecture: Local document indexing + retrieval layer feeding a compact local model; optimized for latency and memory usage on consumer hardware.",
  },
];

const statusColor: Record<string, string> = {
  STABLE: "text-crimson-glow",
  OPERATIONAL: "text-primary",
  TESTING: "text-muted-foreground",
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectArchive;
