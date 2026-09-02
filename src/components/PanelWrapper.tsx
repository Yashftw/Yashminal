import { type ReactNode } from "react";

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: string;
}

const PanelWrapper = ({ title, children, className = "", icon = "■" }: PanelProps) => {
  return (
    <div className={`hud-frame hud-glow hud-glow-pulse h-full ${className}`}>
      <div className="hud-frame-body flex flex-col bg-card dark:glass-panel">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-accent to-accent/70 border-b-2 border-border px-4 py-2.5 flex items-center justify-between shrink-0">
          <h2 className="font-pixel text-[10px] tracking-widest text-primary uppercase">{title}</h2>
          <span className="font-terminal text-xs text-muted-foreground status-dot">{icon}</span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default PanelWrapper;
