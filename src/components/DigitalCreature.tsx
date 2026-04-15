import { useState } from "react";

type CreatureType = "owl" | "fox" | "serpent" | "crow";

interface DigitalCreatureProps {
  type: CreatureType;
  active: boolean;
}

const creatureData: Record<CreatureType, { svg: string; label: string }> = {
  owl: {
    label: "DIGITAL OWL",
    svg: `
      <g class="creature-body">
        <ellipse cx="24" cy="28" rx="14" ry="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="18" cy="22" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="30" cy="22" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="18" cy="22" r="2" fill="currentColor"/>
        <circle cx="30" cy="22" r="2" fill="currentColor"/>
        <path d="M22 28 L24 31 L26 28" fill="currentColor"/>
        <path d="M10 18 L16 14" stroke="currentColor" stroke-width="1.5"/>
        <path d="M38 18 L32 14" stroke="currentColor" stroke-width="1.5"/>
        <path d="M14 36 L10 44" stroke="currentColor" stroke-width="1"/>
        <path d="M34 36 L38 44" stroke="currentColor" stroke-width="1"/>
      </g>
    `,
  },
  fox: {
    label: "GLITCH FOX",
    svg: `
      <g class="creature-body">
        <path d="M12 16 L24 8 L36 16" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 40 L14 16 L24 20 L34 16 L40 40 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="18" cy="26" r="2" fill="currentColor"/>
        <circle cx="30" cy="26" r="2" fill="currentColor"/>
        <path d="M22 30 L24 32 L26 30" fill="currentColor"/>
        <path d="M14 36 L8 40 L20 38" fill="none" stroke="currentColor" stroke-width="1"/>
        <path d="M34 36 L40 40 L28 38" fill="none" stroke="currentColor" stroke-width="1"/>
        <line x1="16" y1="10" x2="12" y2="6" stroke="currentColor" stroke-width="1"/>
        <line x1="32" y1="10" x2="36" y2="6" stroke="currentColor" stroke-width="1"/>
      </g>
    `,
  },
  serpent: {
    label: "MECH SERPENT",
    svg: `
      <g class="creature-body">
        <path d="M8 24 C8 14, 18 10, 24 16 C30 22, 40 18, 40 28 C40 38, 30 42, 24 36 C18 30, 8 34, 8 24" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="14" cy="22" r="2" fill="currentColor"/>
        <path d="M10 26 L6 24 L6 28 Z" fill="currentColor"/>
        <line x1="18" y1="28" x2="22" y2="26" stroke="currentColor" stroke-width="1"/>
        <line x1="26" y1="30" x2="30" y2="28" stroke="currentColor" stroke-width="1"/>
        <line x1="32" y1="34" x2="36" y2="32" stroke="currentColor" stroke-width="1"/>
      </g>
    `,
  },
  crow: {
    label: "DATA CROW",
    svg: `
      <g class="creature-body">
        <ellipse cx="24" cy="26" rx="10" ry="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="20" cy="22" r="2" fill="currentColor"/>
        <circle cx="28" cy="22" r="2" fill="currentColor"/>
        <path d="M22 26 L24 30 L26 26" fill="currentColor"/>
        <path d="M14 20 L6 12" stroke="currentColor" stroke-width="1.5"/>
        <path d="M6 12 L4 18" stroke="currentColor" stroke-width="1"/>
        <path d="M34 20 L42 12" stroke="currentColor" stroke-width="1.5"/>
        <path d="M42 12 L44 18" stroke="currentColor" stroke-width="1"/>
        <path d="M20 38 L18 44" stroke="currentColor" stroke-width="1"/>
        <path d="M28 38 L30 44" stroke="currentColor" stroke-width="1"/>
      </g>
    `,
  },
};

const DigitalCreature = ({ type, active }: DigitalCreatureProps) => {
  const [hovered, setHovered] = useState(false);
  const creature = creatureData[type];

  if (!active) return null;

  return (
    <div
      className="flicker-in flex flex-col items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className={`text-primary creature-idle ${hovered ? "creature-react" : ""}`}
        dangerouslySetInnerHTML={{ __html: creature.svg }}
      />
      <span className="font-pixel text-[6px] text-muted-foreground tracking-wider">
        {creature.label}
      </span>
    </div>
  );
};

export default DigitalCreature;
