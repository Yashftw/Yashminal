import { useCallback, useState } from "react";
import BootSequence from "@/os/BootSequence";
import Desktop from "@/os/Desktop";
import { sfx } from "@/os/sound";

type Phase = "boot" | "desktop" | "off";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("boot");
  // bumped on restart so the boot sequence remounts from scratch
  const [bootKey, setBootKey] = useState(0);
  const [warm, setWarm] = useState(false);

  const restart = useCallback(() => {
    sfx.shutdown();
    setWarm(true);
    setBootKey((k) => k + 1);
    setPhase("boot");
  }, []);

  const shutdown = useCallback(() => {
    sfx.shutdown();
    setWarm(false);
    setBootKey((k) => k + 1);
    setPhase("off");
  }, []);

  if (phase === "desktop") return <Desktop onRestart={restart} onShutdown={shutdown} />;

  return (
    <BootSequence
      key={bootKey}
      startAt={warm ? "warm" : "off"}
      notice={phase === "off" ? "IT IS NOW SAFE TO TURN OFF YOUR PORTFOLIO." : undefined}
      onDone={() => setPhase("desktop")}
    />
  );
};

export default Index;
