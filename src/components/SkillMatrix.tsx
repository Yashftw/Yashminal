import { useEffect, useRef, useState } from "react";
import PanelWrapper from "./PanelWrapper";

interface Skill {
  name: string;
}

const skills: Skill[] = [
  { name: "SQL" },
  { name: "JAVA" },
  { name: "PYTHON" },
  { name: "GCP" },
  { name: "AWS" },
  { name: "AZURE" },
  { name: "AI" },
  { name: "LLAMA" },
];

const SkillMatrix = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
    <div ref={ref}>
      <PanelWrapper title="SKILL DIAGNOSTICS">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`border border-border bg-background px-3 py-2 text-center hover-shimmer transition-all ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="font-terminal text-sm text-foreground tracking-wide">{skill.name}</span>
            </div>
          ))}
        </div>
      </PanelWrapper>
    </div>
  );
};

export default SkillMatrix;
