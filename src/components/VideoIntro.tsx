import { useRef, useEffect } from "react";

const VideoIntro = ({ onComplete }: { onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => onComplete();
    video.addEventListener("ended", handleEnded);

    // Auto-play the intro video
    video.play().catch(() => {
      // If autoplay blocked, skip to boot screen
      onComplete();
    });

    return () => video.removeEventListener("ended", handleEnded);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10001] bg-black flex items-center justify-center cursor-pointer"
      onClick={onComplete}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full h-full object-contain"
        muted
        playsInline
      />
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 font-terminal text-sm text-primary/60 hover:text-primary border border-primary/30 hover:border-primary px-4 py-2 transition-all"
      >
        SKIP ▸
      </button>
    </div>
  );
};

export default VideoIntro;
