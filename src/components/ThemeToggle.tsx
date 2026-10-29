import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("crimson-theme");
      return stored ? stored === "dark" : true;
    } catch {
      // Private browsing / blocked storage — fall back to the default theme.
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("crimson-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="interactive lift-hover rounded-full border-2 border-border bg-card px-3 py-1.5 font-pixel text-[9px] tracking-wider text-primary hover:bg-accent transition-colors panel-glow"
      aria-label="Toggle theme"
    >
      {dark ? "☀ LIGHT" : "☾ DARK"}
    </button>
  );
};

export default ThemeToggle;
