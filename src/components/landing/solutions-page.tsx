"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />

      <main>
        {/* ============= HERO ============= */}
        <section
          data-navbar-theme="dark"
          className="relative px-6 pt-36 pb-16 md:px-10 md:pt-44 md:pb-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
              <span className="h-px w-8 bg-[var(--mk-text-faint)]" />
              Solutions
            </div>
            <h1 className="mt-8 max-w-4xl text-[2.75rem] font-medium leading-[1.05] tracking-tight text-[var(--mk-text)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Built for whatever your business actually tracks.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--mk-text-muted)] sm:text-lg">
              Five industries below. The same engine works for any of them — and
              anything you describe in plain English.
            </p>
          </div>
        </section>

        {/* ============= INTERACTIVE SHOWCASE ============= */}
        <section
          data-navbar-theme="dark"
          className="relative px-6 pb-32 md:px-10"
        >
          <div className="mx-auto max-w-6xl">
            {/* Tab selector */}
            <div className="relative">
              <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
                <div className="inline-flex min-w-full gap-2 border-b border-[var(--mk-border)] md:min-w-0">
                  {INDUSTRY_SOLUTIONS.map((ind) => {
                    const isActive = activeId === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setActiveId(ind.id)}
                        className={[
                          "relative shrink-0 px-1 pb-4 pt-1 text-sm font-medium transition-colors md:text-base",
                          isActive
                            ? "text-[var(--mk-text)]"
                            : "text-[var(--mk-text-faint)] hover:text-[var(--mk-text-muted)]",
                        ].join(" ")}
                      >
                        <span className="px-2">{ind.name}</span>
                        {isActive && (
                          <span className="absolute -bottom-px left-0 right-0 h-px bg-[var(--mk-accent)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active content */}
            <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_460px] lg:gap-16 lg:items-start">
              <div key={active.id} className="animate-[fadeUp_.5s_ease-out]">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--mk-accent)]">
                  {active.entitiesScored}
                </p>
                <h2 className="mt-4 text-3xl font-medium leading-[1.15] tracking-tight text-[var(--mk-text)] sm:text-4xl md:text-[2.75rem]">
                  {active.tagline}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--mk-text-muted)]">
                  {active.pain}
                </p>

                {/* Signals — clean list, no card box */}
                <div className="mt-10">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--mk-text-faint)]">
                    Signals we read
                  </p>
                  <ul className="mt-4 space-y-3">
                    {active.signals.map((sig) => (
                      <li
                        key={sig}
                        className="flex items-baseline gap-3 text-sm text-[var(--mk-text-muted)]"
                      >
                        <span className="font-mono text-[10px] text-[var(--mk-text-faint)]">
                          —
                        </span>
                        {sig}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes — inline text, not chips */}
                <p className="mt-10 max-w-md text-sm leading-relaxed text-[var(--mk-text-muted)]">
                  Teams using Entivia here see{" "}
                  <span className="text-[var(--mk-text)]">
                    {active.keyOutcomes.join(", ").toLowerCase()}
                  </span>
                  .
                </p>
              </div>

              <div key={`mock-${active.id}`} className="lg:sticky lg:top-28">
                <div className="animate-[fadeUp_.55s_ease-out_.05s_both]">
                  {Mock && <Mock />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= CUSTOM INDUSTRY NOTE ============= */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-[var(--mk-border)] px-6 py-28 md:px-10"
        >
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
                Not on this list?
              </p>
              <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.15] tracking-tight text-[var(--mk-text)] sm:text-4xl md:text-5xl">
                Entivia ships no industry-specific rules. Describe what you
                track. The pipeline does the rest.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--mk-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--mk-accent-hover)]"
              >
                Start free
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-[var(--mk-text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--mk-text)]"
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
            transform: translateY(12px);
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
