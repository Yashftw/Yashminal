import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div className="border-2 border-border bg-card px-3 py-2 panel-glow flex items-center gap-3 transition-all duration-500 hover:border-primary/60">
      <span className="text-primary text-sm icon-float">🎵</span>
      <span className="font-pixel text-[8px] text-muted-foreground tracking-wider hidden sm:inline">
        AMBIENT
      </span>
      <button
        onClick={togglePlay}
        className="interactive font-terminal text-sm text-primary hover:text-accent-foreground transition-colors duration-300"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <button
        onClick={() => setMuted(!muted)}
        className="interactive font-terminal text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-14 h-1 accent-primary"
        aria-label="Volume"
      />
    </div>
  );
};

export default MusicPlayer;
