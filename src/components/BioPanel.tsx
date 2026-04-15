import { useState, useRef } from "react";
import PanelWrapper from "./PanelWrapper";
import profileImg from "@/assets/profile.png";

const BioPanel = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [profileGlitch, setProfileGlitch] = useState(false);

  const handleProfileHover = () => {
    setShowProfile(true);
    setProfileGlitch(true);
    setTimeout(() => setProfileGlitch(false), 300);
  };

  return (
    <PanelWrapper title="BIO">
      <div className="relative min-h-[160px]">
        <div className="space-y-2 font-terminal text-sm">
          <div
            onMouseEnter={handleProfileHover}
            onMouseLeave={() => setShowProfile(false)}
            className="interactive"
          >
            <span className="text-muted-foreground text-sm">NAME: </span>
            <div className="text-primary font-bold glitch-hover inline-block font-terminal text-3xl sm:text-4xl tracking-wide mt-1">
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

        {/* Profile picture */}
        {showProfile && (
          <div className="absolute top-0 right-0 flicker-in z-20">
            <div className="absolute -left-16 top-12 w-16 h-[2px] overflow-hidden">
              <div className="w-full h-full bg-primary connection-line" />
              <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-primary status-dot" style={{ animationDuration: "0.8s" }} />
            </div>
            <div className="border-2 border-primary bg-card p-1 panel-glow">
              <div className="bg-accent px-2 py-0.5 border-b border-border mb-1">
                <span className="font-pixel text-[8px] text-primary tracking-wider">ENTITY.IMG</span>
              </div>
              <img
                src={profileImg}
                alt="Yashraj Yadav"
                className={`w-24 h-24 object-cover ${profileGlitch ? "rgb-glitch" : ""}`}
              />
            </div>
          </div>
        )}
      </div>
    </PanelWrapper>
  );
};

export default BioPanel;
