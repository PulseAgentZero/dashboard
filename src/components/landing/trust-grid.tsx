"use client";

// 50 entity cells — H=High, M=Medium, L=Low, G=Healthy
const GRID: Array<"H" | "M" | "L" | "G"> = [
  "H","M","L","G","M","M","L","G","M","L",
  "M","L","G","M","H","M","L","G","L","M",
  "L","M","M","H","G","M","L","M","H","L",
  "M","L","M","L","G","M","H","L","M","G",
  "G","M","H","L","M","G","L","M","L","H",
];

const CELL_COLOR: Record<"H" | "M" | "L" | "G", string> = {
  H: "bg-rose-400",
  M: "bg-amber-400",
  L: "bg-blue-400",
  G: "bg-emerald-500",
};

const LEGEND = [
  { key: "H", dot: "bg-rose-400",    label: "High risk" },
  { key: "M", dot: "bg-amber-400",   label: "Medium"    },
  { key: "L", dot: "bg-blue-400",    label: "Low"       },
  { key: "G", dot: "bg-emerald-500", label: "Healthy"   },
] as const;

export default function TrustGrid() {
  return (
    <>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 28s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }

        @keyframes cellIn {
          from { opacity: 0; transform: scale(0.15); }
          to   { opacity: 1; transform: scale(1); }
        }
        .cell-in {
          opacity: 0;
          animation: cellIn 0.3s cubic-bezier(.34,1.56,.64,1) forwards;
        }

        @keyframes scanMove {
          0%   { left: -6%; }
          100% { left: 106%; }
        }
        .scan-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 3rem;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.04), transparent);
          animation: scanMove 2.8s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        .blink-dot { animation: blinkDot 1.2s ease-in-out infinite; }

        @keyframes riskPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,113,133,0.45); }
          60%       { box-shadow: 0 0 0 5px rgba(251,113,133,0); }
        }
        .pulse-high { animation: riskPulse 2.4s ease-out infinite; }
      `}</style>

      <section
        data-navbar-theme="dark"
        className="relative bg-[#09090b] text-white min-h-screen overflow-hidden flex flex-col items-center select-none"
      >
        {/* Background margin lines */}
        <div className="absolute inset-y-0 left-6 md:left-12 lg:left-24 w-px bg-white/5 pointer-events-none" />
        <div className="absolute inset-y-0 right-6 md:right-12 lg:right-24 w-px bg-white/5 pointer-events-none" />

        {/* Infinite marquee ticker */}
        <div className="w-full border-t border-b border-white/10 bg-neutral-950/60 relative z-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#09090b] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#09090b] to-transparent z-10" />
        </div>

        {/* Core headline */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-20 mb-12 flex flex-col items-center">
          <span className="border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-white/50 uppercase mb-6 bg-white/5 backdrop-blur-xs">
            Entivia Engine
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight max-w-3xl leading-[1.15] text-neutral-100 font-sans">
            Built for every data-rich industry.{" "}
            <span className="text-white/30">No exceptions.</span>
          </h2>
        </div>

        {/* Animated entity scoring grid card */}
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 mb-12">
          <div className="relative bg-white rounded-3xl w-full aspect-16/10 md:aspect-16/8 shadow-2xl overflow-hidden border border-white/10">

            {/* Card header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 md:px-10 pt-6 pb-4 z-20">
              <div className="flex items-center gap-2">
                <span className="blink-dot w-1.5 h-1.5 rounded-full bg-black/60 shrink-0" />
                <span className="font-mono text-[9px] md:text-[10px] text-black/35 uppercase tracking-[0.18em]">
                  Pipeline · scoring 12,400 entities
                </span>
              </div>
              <span className="font-mono text-[9px] text-black/20 tracking-wider hidden sm:block">
                avg 0.9s / batch
              </span>
            </div>

            {/* Entity grid */}
            <div className="absolute inset-0 flex items-center px-7 md:px-10 pt-14 pb-12">
              <div className="relative w-full">
                <div className="scan-line" />
                <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                  {GRID.map((risk, i) => (
                    <div
                      key={i}
                      className={[
                        "cell-in aspect-square rounded-[3px]",
                        CELL_COLOR[risk],
                        risk === "H" ? "pulse-high" : "",
                      ].join(" ")}
                      style={{ animationDelay: `${i * 0.042}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 sm:gap-6 flex-wrap px-7 md:px-10 pb-5 pt-3 z-20">
              {LEGEND.map((l) => (
                <div key={l.key} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-sm ${l.dot}`} />
                  <span className="font-mono text-[9px] text-black/35 uppercase tracking-wider">
                    {l.label}
                  </span>
                </div>
              ))}
              <span className="ml-auto font-mono text-[9px] text-black/20 hidden sm:block">
                50 of 12,400 shown
              </span>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
