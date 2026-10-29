import PanelWrapper from "./PanelWrapper";
import profileImg from "@/assets/profile.png";

const BioPanel = () => {
  return (
    <PanelWrapper title="BIO">
      <div className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 font-terminal text-base">
          <div>
            <span className="text-muted-foreground text-sm">NAME: </span>
            <div className="text-primary text-glow font-bold glitch-hover inline-block font-terminal text-3xl sm:text-4xl tracking-wide mt-1">
              YASHRAJ YADAV
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">ALIAS: </span>
            <span className="text-foreground">YASHFTW</span>
          </div>
          <div>
            <span className="text-muted-foreground">CLASSIFICATION: </span>
            <span className="text-foreground">CLOUD ENGINEER IN TRAINING</span>
          </div>
          <div>
            <span className="text-muted-foreground">STATUS: </span>
            <span className="text-foreground">ACTIVE AND GROWING</span>
          </div>
        </div>

        {/* Profile picture: always visible, glitches in on open */}
        <div className="shrink-0 border-2 border-primary bg-card p-1 profile-glitch-in" style={{ boxShadow: "0 0 16px hsl(var(--primary) / 0.45)" }}>
          <div className="bg-accent px-2 py-0.5 border-b border-border mb-1">
            <span className="font-pixel text-[8px] text-primary tracking-wider">ENTITY.IMG</span>
          </div>
          <img src={profileImg} alt="Yashraj Yadav" className="w-28 h-28 object-cover" />
        </div>
      </div>
    </PanelWrapper>
  );
};

export default BioPanel;
