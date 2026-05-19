"use client";

import {
  Activity,
  Package,
  Truck,
  ShoppingBag,
  Landmark,
  CreditCard,
  Building2,
  Zap,
  Leaf,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

const SECTORS = [
  { name: "Healthcare", icon: <Activity className="w-5 h-5" /> },
  { name: "FMCG", icon: <Package className="w-5 h-5" /> },
  { name: "Logistics", icon: <Truck className="w-5 h-5" /> },
  { name: "Retail", icon: <ShoppingBag className="w-5 h-5" /> },
  { name: "Public Sector", icon: <Landmark className="w-5 h-5" /> },
  { name: "Fintech", icon: <CreditCard className="w-5 h-5" /> },
  { name: "Banking", icon: <Building2 className="w-5 h-5" /> },
  { name: "Private Equity", icon: <Briefcase className="w-5 h-5" /> },
  { name: "Insurance", icon: <ShieldCheck className="w-5 h-5" /> },
  { name: "Energy", icon: <Zap className="w-5 h-5" /> },
  { name: "AgriTech", icon: <Leaf className="w-5 h-5" /> },
];

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
        .ticker-track:hover {
          animation-play-state: paused;
        }
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
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10" />

        <div className="ticker-track py-5">
          {[...SECTORS, ...SECTORS].map((sector, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-8 text-sm font-mono font-semibold text-white/90 uppercase tracking-widest whitespace-nowrap hover:text-white transition-colors duration-200"
            >
              <span className="text-white/70 text-lg leading-none select-none">·</span>
              {sector.icon}
              <span>{sector.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Typographic Messaging Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-20 mb-12 flex flex-col items-center">
        <span className="border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-white/50 uppercase mb-6 bg-white/5 backdrop-blur-xs">
          Pulse Engine
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight max-w-3xl leading-[1.15] text-neutral-100 font-sans">
          The core data platform for enterprise teams. Analyze, build, and
          scale.
        </h2>
      </div>

      {/* Modern Connected Node Matrix Canvas Module */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 mb-12">
        <div className="relative bg-white rounded-3xl w-full aspect-[16/10] md:aspect-[16/8] shadow-2xl overflow-hidden border border-white/10 flex items-center justify-center">
          {/* Node SVG Matrix Connections Background Graph Layout */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none p-8 md:p-16"
            viewBox="0 0 800 400"
            fill="none"
          >
            <path
              d="M 100 50 L 300 150 M 300 50 L 300 150 M 500 50 L 500 150 M 700 50 L 500 150"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
            <path
              d="M 100 200 L 300 200 M 300 150 L 300 200 M 500 150 L 500 200 M 500 200 L 700 200"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
            <path
              d="M 300 200 L 300 350 M 300 200 L 500 350 M 500 200 L 300 350 M 500 200 L 500 350"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
            <path
              d="M 100 350 L 300 350 M 500 350 L 700 350"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
          </svg>

          {/* Interactive SVG Node Dots Overlay Grid map alignment */}
          <div className="absolute inset-0 p-8 md:p-16 grid grid-cols-4 grid-rows-4 items-center justify-items-center z-10">
            {/* Row 1 Nodes */}
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-y-4" />

            {/* Row 2 Nodes */}
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-x-8" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-x-8" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-x-8" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-x-8" />

            {/* Row 3 Nodes */}
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-x-12" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform -translate-x-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-x-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-x-12" />

            {/* Row 4 Nodes */}
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-y-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs transform translate-y-4" />
          </div>

          {/* Locked Premium Middle Call To Action Badge Element */}
          <div className="relative z-20 bg-[#48946c] text-white px-8 py-3.5 rounded-full font-mono font-bold text-xs tracking-widest uppercase border border-white/10 cursor-pointer transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
            Share with Community
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
