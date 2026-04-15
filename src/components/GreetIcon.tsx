import { useState, useEffect, useCallback } from "react";

const POSITIVE_WORDS = ["good", "great", "fine", "doing well", "awesome", "okay", "not bad", "amazing", "excellent", "wonderful", "nice", "well", "cool", "fantastic", "happy", "perfect"];

const GreetIcon = ({ onUnlock }: { onUnlock?: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const handleClick = () => {
    if (!expanded && !dismissed) {
      setExpanded(true);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const lower = userInput.toLowerCase().trim();
    const isPositive = POSITIVE_WORDS.some((w) => lower.includes(w));

    if (isPositive) {
      setResponse("Good. Now you can carry on.");
    } else {
      setResponse("I don't really get it… but it's all right. I suppose you don't want to reply.");
    }

    setTimeout(() => {
      setDismissed(true);
      onUnlock?.();
    }, 2000);
  };

  if (dismissed) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      {/* Red circular terminal indicator */}
      <button
        onClick={handleClick}
        className={`interactive relative w-14 h-14 rounded-full border-2 border-primary bg-card flex items-center justify-center transition-all duration-500 ${
          expanded ? "scale-110 panel-glow" : "glow-pulse"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-primary/80 status-dot" />
        <div className="absolute inset-0 rounded-full border border-primary/30" />
      </button>

      {expanded && !response && (
        <div className="flicker-in w-full max-w-sm space-y-3">
          <div className="border border-border bg-accent p-3 text-center">
            <p className="font-terminal text-sm text-foreground">
              "Greetings. How are you?"
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your response..."
              autoFocus
              className="flex-1 bg-background border border-border px-3 py-1.5 font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="interactive border border-primary bg-accent px-4 py-1.5 font-pixel text-[8px] text-primary hover:bg-primary hover:text-primary-foreground tracking-wider transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {response && (
        <div className="flicker-in border border-border bg-accent p-3 max-w-sm text-center">
          <p className="font-terminal text-sm text-foreground">"{response}"</p>
        </div>
      )}

      {!expanded && (
        <span className="font-pixel text-[8px] text-muted-foreground tracking-wider animate-pulse">
          [ CLICK TO INTERACT ]
        </span>
      )}
    </div>
  );
};

export default GreetIcon;
