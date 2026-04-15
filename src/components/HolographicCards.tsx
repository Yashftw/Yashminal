const HolographicCards = () => {
  return (
    <>
      {/* Left side - Stacked Aces */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-3">
        <div className="card-float" style={{ animationDelay: "0s" }}>
          <AceCard suit="♠" rotation={-8} />
        </div>
        <div className="card-float" style={{ animationDelay: "1.5s" }}>
          <AceCard suit="♥" rotation={-4} />
        </div>
      </div>

      {/* Right side - Joker */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex items-center">
        <div className="card-float" style={{ animationDelay: "0.8s" }}>
          <JokerCard />
        </div>
      </div>
    </>
  );
};

const AceCard = ({ suit, rotation }: { suit: string; rotation: number }) => (
  <div
    className="w-20 h-30 border border-primary/40 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center holo-shimmer opacity-60"
    style={{ transform: `rotate(${rotation}deg)`, width: "5rem", height: "7.5rem" }}
  >
    <span className="font-terminal text-2xl text-primary">{suit}</span>
    <span className="font-pixel text-[7px] text-primary/60 tracking-widest mt-1">ACE</span>
    <span className="font-terminal text-sm text-primary/40 mt-0.5">{suit}</span>
  </div>
);

const JokerCard = () => (
  <div
    className="border border-primary/40 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center holo-shimmer opacity-60"
    style={{ transform: "rotate(6deg)", width: "5rem", height: "7.5rem" }}
  >
    <span className="font-terminal text-2xl text-primary">🃏</span>
    <span className="font-pixel text-[6px] text-primary/60 tracking-widest mt-1">JOKER</span>
  </div>
);

export default HolographicCards;
