"use client";

import { BarChart3, Users, Landmark } from "lucide-react";

const PROBLEMS = [
  {
    icon: BarChart3,
    title: "BI Tools Just Show Past Charts",
    description: "Power BI and Tableau tell you what happened last month. They don't reason, they don't predict, and they definitely don't tell your operators what to do right now.",
  },
  {
    icon: Users,
    title: "Custom ML Costs Too Much Time",
    description: "Building proprietary predictive models takes months, thousands of dollars, and dedicated data scientists that most enterprise operational teams don't have.",
  },
  {
    icon: Landmark,
    title: "Rigid & Locked AI Solutions",
    description: "Traditional enterprise AI vendor models are incredibly expensive, difficult to configure, and hard-locked to single, specific industries or overseas infrastructures.",
  },
];

export default function Problem() {
  return (
    <section
      id="problem"
      data-navbar-theme="light"
      className="bg-neutral-50 text-neutral-900 py-12 sm:py-24 lg:py-32 border-b border-neutral-200/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Eyebrow & Headline */}
        <div className="max-w-3xl mb-10 sm:mb-20 lg:mb-24">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-neutral-900 leading-snug sm:leading-[1.1]">
            Your operational data is growing instantly—but your decisions are still reactive.
          </h2>
          <p className="mt-4 sm:mt-6 text-neutral-600 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
            Enterprises generate massive transaction logs, subscriber sessions, and inventory tracking cycles, yet discover systemic churn and stockouts days after they occur.
          </p>
        </div>

        {/* Problem Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {PROBLEMS.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col border border-neutral-200/60 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 bg-white transition-colors duration-200"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-4 sm:mb-6 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 mb-2 sm:mb-3">
                  {prob.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm lg:text-[15px] leading-relaxed">
                  {prob.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quantified Impact Banner */}
        <div className="mt-6 sm:mt-12 p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-neutral-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 block mb-1">
              The Bottom Line
            </span>
            <p className="text-xs sm:text-sm lg:text-base font-medium text-neutral-200 leading-relaxed max-w-xl">
              Reactive operational workflows lead to a critical leak in net revenue retention across emerging markets.
            </p>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-serif text-orange-500 shrink-0 font-bold self-end md:self-auto">
            -24% NRR
          </div>
        </div>

      </div>
    </section>
  );
}