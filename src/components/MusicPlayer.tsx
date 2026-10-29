import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.preload = "none";
    audioRef.current = audio;

    /* Keep the button in step with the element rather than assuming the
       toggle worked: autoplay policy, a decode failure or a missing file all
       leave playback stopped while the UI happily claims otherwise. */
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      setUnavailable(true);
      setPlaying(false);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
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
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setUnavailable(true);
        setPlaying(false);
      });
    }
  };

  return (
    <div className="rounded-full border-2 border-border bg-card px-3 py-2 panel-glow flex items-center gap-3 transition-colors duration-500 hover:border-primary/60">
      <span className="text-primary text-sm icon-float">🎵</span>
      <span className="font-pixel text-[8px] text-muted-foreground tracking-wider hidden sm:inline">
        AMBIENT
      </span>
      <button
        onClick={togglePlay}
        disabled={unavailable}
        title={unavailable ? "No ambient track available" : undefined}
        className="interactive font-terminal text-sm text-primary hover:text-accent-foreground transition-colors duration-300 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:text-muted-foreground"
        aria-label={unavailable ? "Ambient track unavailable" : playing ? "Pause" : "Play"}
      >
        {unavailable ? "⃠" : playing ? "❚❚" : "▶"}
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
