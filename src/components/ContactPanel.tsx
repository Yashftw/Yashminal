const fieldClass =
  "w-full bg-transparent px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none";

/** Inputs can't carry the HUD pseudo-fill, so the frame lives on a wrapper. */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">{label}</div>
    <div
      className="hud-box focus-within:[--hud-line:var(--primary)] transition-colors"
      style={{ ["--hud-fill" as string]: "hsl(var(--background))" }}
    >
      {children}
    </div>
  </div>
);

const ContactPanel = () => {
  return (
    <div id="contact-section" className="h-full">
      <div className="hud-frame hud-glow hud-glow-pulse h-full">
        <div className="hud-frame-body flex flex-col bg-card dark:glass-panel">
          <div className="bg-gradient-to-r from-accent to-accent/70 border-b-2 border-border px-4 py-2 flex items-center justify-between shrink-0">
            <span className="font-pixel text-[10px] tracking-wider text-primary">CONTACT ME</span>
            <span className="text-muted-foreground font-terminal text-xs">▣</span>
          </div>

          <form
            action="https://formsubmit.co/yashrajyadav20055@gmail.com"
            method="POST"
            className="p-5 space-y-4 flex-1"
          >
            <input type="hidden" name="_subject" value="New message from Yashminal portfolio" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <Field label="NAME">
              <input name="name" required placeholder="Enter your designation..." className={fieldClass} />
            </Field>

            <Field label="EMAIL">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your comm channel..."
                className={fieldClass}
              />
            </Field>

            <Field label="MESSAGE">
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Compose your transmission..."
                className={`${fieldClass} resize-none`}
              />
            </Field>

            <button
              type="submit"
              className="interactive lift-hover hud-box hud-glow w-full group"
              style={{
                ["--bw" as string]: "2px",
                ["--hud-fill" as string]: "hsl(var(--accent))",
                ["--hud-line" as string]: "var(--primary)",
              }}
            >
              <span className="block px-4 py-3 font-pixel text-[10px] tracking-wider text-primary transition-colors">
                TRANSMIT MESSAGE
              </span>
            </button>

            <div className="pt-2 border-t border-border">
              <div className="font-terminal text-[11px] text-muted-foreground">
                ▸ Messages are delivered directly to{" "}
                <span className="text-foreground">yashrajyadav20055@gmail.com</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPanel;
