"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import FinalCTA from "@/components/landing/final-CTA";
import {
  HealthcareMock,
  LogisticsMock,
  PublicSectorMock,
  RetailMock,
  TelecomMock,
} from "@/components/landing/industry-mocks";
import { INDUSTRY_SOLUTIONS } from "@/lib/marketing/industries";

const MOCK_FOR: Record<string, React.ComponentType> = {
  telecom: TelecomMock,
  healthcare: HealthcareMock,
  "fmcg-retail": RetailMock,
  logistics: LogisticsMock,
  "public-sector": PublicSectorMock,
};

export function SolutionsPage() {
  const [activeId, setActiveId] = useState(INDUSTRY_SOLUTIONS[0].id);
  const active =
    INDUSTRY_SOLUTIONS.find((i) => i.id === activeId) ?? INDUSTRY_SOLUTIONS[0];
  const Mock = MOCK_FOR[active.id];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800">
      <Navbar />

      <main>
        {/* ============= HERO ============= */}
        <section
          data-navbar-theme="dark"
          className="relative px-4 pt-28 pb-12 sm:px-6 md:px-10 md:pt-40 md:pb-20 lg:pt-44"
        >
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800/60 text-zinc-400 font-mono text-[10px] uppercase tracking-wider font-semibold mb-6">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Dynamic Use Cases
            </div>
            
            <h1 className="max-w-4xl font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
              Built for whatever your business actually tracks.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg font-medium">
              Five industries below. The same core engine maps to any dataset or dynamic metric workspace you express in plain English.
            </p>
          </div>
        </section>

        {/* ============= INTERACTIVE SHOWCASE ============= */}
        <section
          data-navbar-theme="dark"
          className="relative px-4 pb-24 sm:px-6 md:px-10 md:pb-32"
        >
          <div className="mx-auto max-w-6xl">
            {/* Tab selector - Horizontally swipeable on touch screens */}
            <div className="relative border-b border-zinc-900">
              <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
                <div className="inline-flex min-w-full gap-6 sm:gap-8 md:min-w-0">
                  {INDUSTRY_SOLUTIONS.map((ind) => {
                    const isActive = activeId === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setActiveId(ind.id)}
                        className={[
                          "relative shrink-0 pb-4 pt-1 text-xs sm:text-sm font-bold uppercase font-mono tracking-wider transition-colors",
                          isActive
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-300",
                        ].join(" ")}
                      >
                        <span>{ind.name}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-100" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Content Grid Workspace */}
            <div className="mt-10 sm:mt-14 grid gap-10 lg:grid-cols-[1fr_480px] lg:gap-16 lg:items-start">
              <div key={active.id} className="animate-[fadeUp_.45s_ease-out]">
                
                {/* Meta Header */}
                <span className="inline-block text-[10px] font-bold font-mono uppercase tracking-widest text-orange-400 bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 rounded">
                  {active.entitiesScored}
                </span>
                
                {/* Headline Tagline */}
                <h2 className="mt-4 font-serif text-2xl font-normal leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
                  &quot;{active.tagline}&quot;
                </h2>
                
                {/* Challenge Blurb */}
                <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
                  {active.pain}
                </p>

                {/* Signals Content List Block */}
                <div className="mt-8 border-t border-zinc-900 pt-6">
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-500">
                    Signals Evaluated Automatically
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {active.signals.map((sig) => (
                      <li
                        key={sig}
                        className="flex items-start gap-3 text-xs sm:text-sm text-zinc-400 font-medium"
                      >
                        <span className="font-mono text-zinc-700 shrink-0 mt-0.5">—</span>
                        <span className="leading-normal">{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes Accent Segment */}
                <div className="mt-8 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/40 max-w-xl">
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-medium">
                    Teams utilizing Entivia inside this workspace experience{" "}
                    <span className="text-white font-bold underline decoration-orange-500/30 underline-offset-4">
                      {active.keyOutcomes.join(", ").toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Graphical Canvas Mock Sidecar */}
              <div key={`mock-${active.id}`} className="lg:sticky lg:top-28">
                <div className="animate-[fadeUp_.5s_ease-out_.05s_both] bg-zinc-900/40 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl ring-1 ring-white/5">
                  {Mock && <Mock />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= CUSTOM INDUSTRY NOTE ============= */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-zinc-900 bg-zinc-950 px-4 py-20 sm:px-6 md:px-10 md:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-500">
                Alternative Infrastructure Paths
              </p>
              <h2 className="mt-4 max-w-3xl font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-snug tracking-tight text-zinc-300">
                Entivia relies on zero localized industry presets. Describe your custom telemetry data directly in simple plain text, and our workflow layer structures the pipeline execution paths instantly.
              </h2>
            </div>
            
            <div className="flex flex-row items-center gap-4 shrink-0 sm:mt-2 lg:mt-0">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-950 shadow-sm hover:bg-zinc-200 transition-colors"
              >
                Start free
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-3 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}