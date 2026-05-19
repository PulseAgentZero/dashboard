"use client";

import React from "react";

export default function Hero() {
  return (
    <>
      <style>{`
        .hero-gradient {
          background: linear-gradient(-45deg, #e8390e, #f7620a, #ffcd43, #ff3366, #c9260c, #ff8c00);
          background-size: 400% 400%;
          animation: gradientShift 14s ease infinite;
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          25%  { background-position: 50% 0%; }
          50%  { background-position: 100% 50%; }
          75%  { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          30%       { transform: translate(40px, -60px) scale(1.12); }
          60%       { transform: translate(-30px, 40px) scale(0.92); }
        }

        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          35%       { transform: translate(-50px, 30px) scale(1.08); }
          70%       { transform: translate(30px, -40px) scale(1.15); }
        }

        @keyframes blob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(20px, 50px) scale(0.9); }
          80%       { transform: translate(-40px, -20px) scale(1.1); }
        }

        .blob-1 { animation: blob1 18s ease-in-out infinite; }
        .blob-2 { animation: blob2 22s ease-in-out infinite; }
        .blob-3 { animation: blob3 16s ease-in-out infinite; }

        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.045;'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <section
        data-navbar-theme="dark"
        className="hero-gradient grain relative min-h-screen flex flex-col justify-between pt-36 sm:pt-40 md:pt-44 overflow-hidden"
      >
        {/* Floating blob layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="blob-1 absolute top-[-20%] left-[-10%] w-[80%] sm:w-[70%] h-[90%] rounded-full bg-[#ff1a4b]/50 blur-[80px] md:blur-[100px]" />
          <div className="blob-2 absolute bottom-[-15%] right-[-5%] w-[75%] sm:w-[65%] h-[85%] rounded-full bg-[#c9260c]/60 blur-[90px] md:blur-[110px]" />
          <div className="blob-3 absolute top-[30%] left-[20%] sm:left-[35%] w-[55%] h-[60%] rounded-full bg-[#ffaa00]/40 blur-[70px] md:blur-[90px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 my-auto flex flex-col items-center justify-center grow">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.15] sm:leading-[1.1] mb-6 drop-shadow-sm">
            Turn onchain data <br className="hidden sm:block" /> into raw leverage.
          </h1>

          <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium max-w-md sm:max-w-xl leading-relaxed mb-8 px-2">
            Build with the execution engine <br />
            <span className="opacity-75 text-sm sm:text-base md:text-lg">
              Indexing block data in under 150ms
            </span>
          </p>

          <button className="bg-white text-black font-mono font-bold tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:bg-black hover:text-white active:scale-98 transition-all duration-300 uppercase">
            Explore Data
          </button>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="relative z-10 w-full border-t border-white/20 bg-black/10 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 text-white divide-x-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Metric 1 */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-5 border-b border-r border-white/10 md:border-b-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">100+</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">
                Chains
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-5 border-b border-white/10 md:border-b-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">1M+</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">
                Users
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-5 border-r border-white/10 md:border-r-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">1.5M+</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">
                Datasets
              </span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">AI</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">
                Ready
              </span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}