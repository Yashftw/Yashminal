import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("crimson-theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("crimson-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    // Ensure dark class on mount
    const stored = localStorage.getItem("crimson-theme");
    if (!stored || stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="interactive border-2 border-border bg-card px-3 py-1.5 font-pixel text-[9px] tracking-wider text-primary hover:bg-accent transition-all panel-glow"
      aria-label="Toggle theme"
    >
      {dark ? "☀ LIGHT" : "☾ DARK"}
    </button>
  );
};

export default ThemeToggle;
