"use client";

import React, { useEffect, useRef } from "react";

export default function FeatureExplorer() {
  const meshRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance background fluid movement context loop for the feature image frame
  useEffect(() => {
    const canvas = meshRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let id: number;
    canvas.width = 450;
    canvas.height = 450;

    let time = 0;

    const drawMesh = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a shifting dual-color horizontal mesh gradient match
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      const wave1 = Math.sin(time * 2) * 15;
      const wave2 = Math.cos(time * 1.5) * 20;

      gradient.addColorStop(0, `hsl(${30 + wave1}, 95%, 60%)`);  // Shifting Warm Orange
      gradient.addColorStop(0.5, `hsl(${345 + wave2}, 90%, 52%)`); // Deep Pink Red Aurora
      gradient.addColorStop(1, `hsl(${15 + wave1}, 100%, 55%)`);  // Bright Gold Dune Hue

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render overlay organic vertical color bands matching the screenshot texture
      for (let i = 0; i < canvas.width; i += 4) {
        const heightFactor = Math.sin(i * 0.015 + time * 4) * 45;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(i * 0.005)) * 0.08})`;
        ctx.fillRect(i, 0, 2, canvas.height + heightFactor);
      }

      id = requestAnimationFrame(drawMesh);
    };

    drawMesh();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.01); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.03); }
        }
        .animate-float-dashboard {
          animation: floatCard 7s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: subtlePulse 4s ease-in-out infinite;
        }
      `}</style>

      <section
        data-navbar-theme="light"
        className="relative bg-[#09090b] text-white min-h-[85vh] py-20 md:py-32 flex items-center justify-center overflow-hidden select-none"
      >
        {/* Background alignment alignment layout grids */}
        <div className="absolute inset-y-0 left-6 md:left-12 lg:left-24 w-px bg-white/5 pointer-events-none" />
        <div className="absolute inset-y-0 right-6 md:right-12 lg:right-24 w-px bg-white/5 pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10">
          
          {/* Left Text Content Frame Column */}
          <div className="flex flex-col items-start max-w-xl">
            <span className="text-white/60 font-serif text-xl sm:text-2xl mb-4 tracking-tight">
              Live dashboard
            </span>
            
            <h2 className="text-4xl sm:text-5xl md:text-[54px] font-normal tracking-tight text-white leading-[1.12] mb-10 font-sans">
              See risk shift the moment <br /> your data changes — <br /> not weeks later
            </h2>

            <a
              href="/features"
              className="inline-block bg-white text-black font-mono font-bold tracking-widest text-xs px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-neutral-200 active:scale-95 uppercase shadow-md"
            >
              See features
            </a>
          </div>

          {/* Right Column Layout: Animated Dashboard Canvas Platform */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-white/5 bg-neutral-900/40">
              
              {/* Dynamic canvas backdrop mesh */}
              <canvas 
                ref={meshRef} 
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Glassmorphic Live Interface Data Overlay Layer */}
              <div className="absolute inset-0 p-6 flex items-center justify-center bg-black/5 backdrop-blur-xs z-10">
                
                {/* Floating Metrics Module Panel Card */}
                <div className="animate-float-dashboard w-[85%] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl relative">
                  
                  {/* Top Panel Context Bar Details */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] font-mono tracking-wider uppercase">Active Index</span>
                      <span className="text-sm font-semibold tracking-tight text-white/90">Risk index</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                      <span className="text-[9px] font-mono text-white/70">9d VOL</span>
                    </div>
                  </div>

                  {/* Micro Bar Chart Layout Vector */}
                  <div className="h-28 flex items-end gap-1.5 pt-2 px-1 relative">
                    {/* Horizontal background scale threshold metrics indicators */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
                    <div className="absolute inset-x-0 bottom-8 h-px bg-white/5" />
                    <div className="absolute inset-x-0 bottom-16 h-px bg-white/5" />

                    {/* Sequential Chart Bars */}
                    {[20, 28, 24, 38, 32, 45, 52, 42, 61, 55, 74, 82, 68, 95, 110, 125, 105, 140].map((val, idx) => (
                      <div key={idx} className="w-full flex flex-col justify-end h-full group relative">
                        <div 
                          className="w-full bg-white/90 rounded-t-xs transition-all duration-500 origin-bottom group-hover:bg-emerald-400" 
                          style={{ height: `${(val / 150) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer Author Meta Context */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shrink-0" />
                    <span className="text-[10px] font-mono text-white/50 tracking-tight">@joneso</span>
                  </div>

                </div>

                {/* Secondary Offset Background Card Module Layer (Right Edge Context) */}
                <div className="absolute top-24 -right-16 w-44 bg-black/30 backdrop-blur-md rounded-xl border border-white/5 p-4 transform rotate-2 opacity-50 pointer-events-none hidden sm:block">
                  <span className="text-[9px] font-mono text-white/40 block mb-1 uppercase tracking-widest">Analytics</span>
                  <span className="text-xs font-medium text-white/80 block">Entity trends</span>
                  <div className="w-full h-px bg-white/10 my-2" />
                  <div className="h-4 flex items-center gap-0.5">
                    {[20, 60, 40, 80, 50, 30].map((h, i) => (
                      <div key={i} className="w-1 bg-white/40 rounded-full" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}