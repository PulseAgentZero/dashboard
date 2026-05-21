"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/lib/marketing/industries";
import {
  TelecomMock,
  HealthcareMock,
  RetailMock,
  LogisticsMock,
  PublicSectorMock,
} from "@/components/landing/industry-mocks";

const MOCK_FOR: Record<string, React.ComponentType> = {
  telecom: TelecomMock,
  healthcare: HealthcareMock,
  "fmcg-retail": RetailMock,
  logistics: LogisticsMock,
  "public-sector": PublicSectorMock,
};

export default function IndustriesSection() {
  const [activeId, setActiveId] = useState(INDUSTRY_SOLUTIONS[0].id);
  const active = INDUSTRY_SOLUTIONS.find((i) => i.id === activeId) ?? INDUSTRY_SOLUTIONS[0];
  const Mock = MOCK_FOR[active.id];

  return (
    <section
      data-navbar-theme="dark"
      className="bg-[var(--mk-surface)] px-4 py-24 md:px-10 lg:px-28"
    >
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
            Industries
          </span>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-[var(--mk-text)] md:text-5xl">
            One engine.
            <br />
            Every industry.
          </h2>
        </div>
        <Link
          href="/solutions"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--mk-text-muted)] hover:text-[var(--mk-text)] transition-colors"
        >
          See all solutions <ArrowRight size={14} />
        </Link>
      </div>

      {/* industry tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {INDUSTRY_SOLUTIONS.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => setActiveId(industry.id)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-all",
              activeId === industry.id
                ? "bg-[var(--mk-accent)] text-white"
                : "border border-[var(--mk-border)] text-[var(--mk-text-muted)] hover:border-[var(--mk-text-faint)] hover:text-[var(--mk-text)]",
            ].join(" ")}
          >
            {industry.name}
          </button>
        ))}
      </div>

      {/* active industry content */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        {/* left: description */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)] mb-3">
            {active.entitiesScored} scored
          </p>
          <h3 className="text-2xl font-black text-[var(--mk-text)] leading-tight">
            {active.tagline}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--mk-text-muted)]">
            {active.pain}
          </p>

          <div className="mt-6 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
              Signals Entivia reads
            </p>
            {active.signals.map((sig) => (
              <div key={sig} className="flex items-start gap-2 text-sm text-[var(--mk-text-muted)]">
                <span className="mt-0.5 text-[var(--mk-accent)]">·</span>
                {sig}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
              Key outcomes
            </p>
            {active.keyOutcomes.map((o) => (
              <div key={o} className="flex items-center gap-2 text-sm text-[var(--mk-text-muted)]">
                <Check size={12} className="shrink-0 text-emerald-400" />
                {o}
              </div>
            ))}
          </div>
        </div>

        {/* right: mock UI */}
        <div className="max-w-sm">
          <Mock />
        </div>
      </div>
    </section>
  );
}
