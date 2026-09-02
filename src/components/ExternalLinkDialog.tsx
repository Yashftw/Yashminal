import { useState } from "react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ExternalLinkDialog = ({ href, children, className = "" }: ExternalLinkProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={`interactive text-foreground hover:text-primary transition-colors ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>

      {showConfirm && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm scroll-fade-in">
          <div className="modal-pop-in hud-frame hud-glow max-w-md w-full mx-4">
            <div className="hud-frame-body bg-card dark:glass-panel">
            <div className="bg-gradient-to-r from-accent to-accent/70 border-b-2 border-border px-4 py-2">
              <span className="font-pixel text-[10px] text-primary tracking-wider">
                EXTERNAL REDIRECT WARNING
              </span>
            </div>

            <div className="p-6 text-center">
              <p className="font-terminal text-lg text-foreground mb-2">
                You are leaving Yashminal.
              </p>
              <p className="font-terminal text-sm text-muted-foreground mb-6">
                Proceed?
              </p>

              <div className="flex gap-4 justify-center">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowConfirm(false)}
                  className="interactive lift-hover hud-box hud-glow"
                  style={{
                    ["--bw" as string]: "2px",
                    ["--hud-fill" as string]: "hsl(var(--accent))",
                    ["--hud-line" as string]: "var(--primary)",
                  }}
                >
                  <span className="block px-6 py-2 font-pixel text-[10px] text-primary tracking-wider">
                    PROCEED
                  </span>
                </a>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="interactive lift-hover hud-box"
                  style={{ ["--bw" as string]: "2px", ["--hud-fill" as string]: "hsl(var(--card))" }}
                >
                  <span className="block px-6 py-2 font-pixel text-[10px] text-muted-foreground hover:text-foreground transition-colors tracking-wider">
                    CANCEL
                  </span>
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExternalLinkDialog;
