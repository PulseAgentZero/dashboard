"use client";

import { useEffect, useState, useRef } from "react";
import { Phone, HeartPulse, ShoppingCart, ArrowUpRight } from "lucide-react";

const INDUSTRIES = [
  {
    id: "telecom",
    name: "Telecom & Subscriptions",
    icon: Phone,
    tagline: "Prevent subscriber churn before it reflects on the month-end ledger.",
    problem: "Subscribers drop off without explicit complaints. Identifying usage decline or specific wallet drop signals manually across millions of users takes days.",
    solution: "Entivia tracks micro-movements in subscriber balances, recharging delays, and drops in data consumption to assign real-time churn risk indicators automatically.",
    metric: "28% Churn Reduction",
  },
  {
    id: "healthcare",
    name: "Healthcare Systems",
    icon: HeartPulse,
    tagline: "Predict and manage ward occupancy and resource distribution constraints.",
    problem: "Hospital managers make resource choices using historical charts. By the time emergency admissions cross healthy capacities, staff are already completely overwhelmed.",
    solution: "The engine scans admitting tables, operational shift rosters, and historical discharge intervals to provide actionable nurse allocation scores to operational managers.",
    metric: "4.2x Faster Allocation",
  },
  {
    id: "fmcg",
    name: "FMCG & Distribution",
    icon: ShoppingCart,
    tagline: "Stop losing revenue to systemic warehouse or retail stockouts.",
    problem: "Distributors find out a critical SKU is completely out of stock hours after shelves empty, killing immediate transactional momentum across high-volume trade routes.",
    solution: "Continuous database checks trigger automated reorder signals directly to suppliers when stock velocities intersect local fulfillment timeline windows.",
    metric: "18% Revenue Recovery",
  }
];

export default function Industries() {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return;
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - window.innerHeight)));
      
      const nextIndex = Math.min(
        INDUSTRIES.length - 1,
        Math.floor(progress * INDUSTRIES.length)
      );
      
      setActiveTab(nextIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="industries"
      ref={containerRef}
      data-navbar-theme="light"
      className="bg-neutral-50 text-neutral-900 py-12 sm:py-20 lg:py-32 border-b border-neutral-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-neutral-900 leading-[1.15] sm:leading-[1.1]">
            One universal engine. Built for your specific industry.
          </h2>
          <p className="mt-4 sm:mt-6 text-neutral-500 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
            Zero specialized code changes required. Entivia custom-maps to your local schema layouts to optimize live front-line operations instantly.
          </p>
        </div>

        {/* Industry Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          
          {/* Tab Selection Column */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory">
            {INDUSTRIES.map((ind, idx) => {
              const Icon = ind.icon;
              const isSelected = activeTab === idx;
              
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(idx)}
                  className={[
                    "w-[280px] sm:w-[320px] lg:w-full shrink-0 snap-start text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 border transition-all duration-300 outline-none group",
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-800 shadow-sm"
                      : "bg-white lg:bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300",
                  ].join(" ")}
                >
                  <div className={[
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-white/10 text-white" : "bg-neutral-50 border border-neutral-200 text-neutral-600"
                  ].join(" ")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-tight text-xs sm:text-sm lg:text-base group-hover:translate-x-0.5 transition-transform duration-300">
                    {ind.name}
                  </span>
                  <ArrowUpRight className={[
                    "w-4 h-4 ml-auto hidden sm:block transition-all",
                    isSelected ? "text-white/40" : "text-neutral-400 opacity-0 group-hover:opacity-100"
                  ].join(" ")} />
                </button>
              );
            })}
          </div>

          {/* Tab Detailed Content Viewer Block */}
          <div className="lg:col-span-8">
            <div className="h-full bg-white lg:bg-neutral-50 border border-neutral-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] transition-all duration-200">
              
              <div>
                <div className="font-mono text-[10px] sm:text-xs text-[#ea580c] font-bold tracking-wider uppercase mb-2 sm:mb-3">
                  {INDUSTRIES[activeTab].name} Case Profile
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-neutral-900 tracking-tight leading-snug lg:leading-tight mb-6 sm:mb-8">
                  &quot;{INDUSTRIES[activeTab].tagline}&quot;
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 border-t border-neutral-200/80 pt-6 sm:pt-8">
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold mb-1.5 sm:mb-2">
                      The Challenge
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {INDUSTRIES[activeTab].problem}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold mb-1.5 sm:mb-2">
                      Entivia Enforcement
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 lg:text-neutral-700 font-medium leading-relaxed">
                      {INDUSTRIES[activeTab].solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Performance Metric Block (Fixed wrap overflow constraints) */}
              <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
                  Target Operational Gain
                </span>
                <div className="bg-neutral-50 lg:bg-white border border-neutral-200/80 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 font-serif text-neutral-900 font-bold text-xs sm:text-sm lg:text-base shadow-sm max-w-full text-center sm:text-left whitespace-nowrap">
                  {INDUSTRIES[activeTab].metric}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}