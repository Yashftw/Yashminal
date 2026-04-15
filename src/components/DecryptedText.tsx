import { useState, useEffect, useRef, type ReactNode } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?/\\|<>{}[]~^";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  icon?: ReactNode;
}

const DecryptedText = ({ text, speed = 110, icon }: DecryptedTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [revealed, setRevealed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          startDecryption();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const startDecryption = () => {
    let rev = 0;
    const interval = setInterval(() => {
      rev++;
      if (rev > text.length) {
        clearInterval(interval);
        setRevealed(text.length);
        setDisplayed(text);
        return;
      }

      // Build string: revealed chars + scrambled remaining from center out
      const mid = Math.floor(text.length / 2);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const distFromCenter = Math.abs(i - mid);
        const revealThreshold = Math.floor(rev * (text.length / (text.length + distFromCenter)));
        if (revealThreshold >= rev || rev > text.length - 2) {
          // Check if this position should be revealed
          const leftReveal = mid - Math.floor(rev / 2);
          const rightReveal = mid + Math.floor(rev / 2);
          if (i >= leftReveal && i <= rightReveal) {
            result += text[i];
          } else {
            result += text[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        } else {
          result += text[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayed(result);
      setRevealed(rev);
    }, speed);
  };

  return (
    <div ref={ref} className="flex items-center gap-2">
      {icon && <span className="icon-float text-primary text-lg">{icon}</span>}
      <span className="font-pixel text-[10px] tracking-wider uppercase">
        {displayed.split("").map((char, i) => {
          const mid = Math.floor(text.length / 2);
          const leftReveal = mid - Math.floor(revealed / 2);
          const rightReveal = mid + Math.floor(revealed / 2);
          const isRevealed = i >= leftReveal && i <= rightReveal && revealed > 0;
          return (
            <span
              key={i}
              className={isRevealed ? "text-primary" : "text-muted-foreground"}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default DecryptedText;
