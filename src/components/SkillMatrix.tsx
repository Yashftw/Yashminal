import { useEffect, useRef, useState } from "react";
import PanelWrapper from "./PanelWrapper";

interface Skill {
  name: string;
  /** HSL triplet driving the card's accent + corner glyph */
  accent: string;
  icon: string;
}

const skills: Skill[] = [
  { name: "SQL",    accent: "28 92% 58%",  icon: "▤" },
  { name: "JAVA",   accent: "8 85% 60%",   icon: "⬢" },
  { name: "PYTHON", accent: "48 95% 58%",  icon: "⧉" },
  { name: "GCP",    accent: "212 92% 62%", icon: "☁" },
  { name: "AWS",    accent: "33 95% 55%",  icon: "▲" },
  { name: "AZURE",  accent: "199 92% 55%", icon: "◈" },
  { name: "AI",     accent: "270 85% 68%", icon: "⌬" },
  { name: "LLAMA",  accent: "142 68% 50%", icon: "⏣" },
];

const SkillMatrix = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      <PanelWrapper title="SKILL DIAGNOSTICS" icon="▤">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              onMouseEnter={() => setHovered(skill.name)}
              onMouseLeave={() => setHovered(null)}
              className={`lift-hover hud-box hud-glow hover-shimmer transition-opacity duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: `${i * 45}ms`,
                ["--hud-fill" as string]: "hsl(var(--background))",
                ["--hud-line" as string]:
                  hovered === skill.name ? `${skill.accent}` : `${skill.accent} / 0.45`,
              }}
            >
              {/* accent wash */}
              <span
                className="pointer-events-none absolute inset-[1px] transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 100% 0%, hsl(${skill.accent} / 0.18), transparent 65%)`,
                  opacity: hovered === skill.name ? 1 : 0,
                }}
              />

              <div className="relative px-3 py-2.5">
                {/* retro glyph, upper right, themed to the skill */}
                <span
                  className="absolute top-1 right-1.5 font-terminal text-[13px] leading-none transition-transform duration-300"
                  style={{
                    color: `hsl(${skill.accent})`,
                    transform: hovered === skill.name ? "translateY(-1px) scale(1.15)" : "none",
                  }}
                >
                  {skill.icon}
                </span>

                <span className="block pr-4 font-terminal text-sm text-foreground tracking-wide">
                  {skill.name}
                </span>

                {/* tiny themed level ticks */}
                <span className="mt-1.5 flex gap-[3px]">
                  {Array.from({ length: 6 }).map((_, t) => (
                    <span
                      key={t}
                      className="h-[3px] w-[6px] transition-opacity duration-300"
                      style={{
                        background: `hsl(${skill.accent})`,
                        opacity: hovered === skill.name ? 0.9 - t * 0.1 : 0.35 - t * 0.04,
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PanelWrapper>
    </div>
  );
};

export default SkillMatrix;
