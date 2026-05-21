import React from "react";

export default function ModelingSection() {
  return (
    <section
      data-navbar-theme="dark"
      className="w-full bg-[var(--mk-bg)] text-[var(--mk-text-muted)] font-mono text-xs leading-relaxed selection:bg-[var(--mk-accent-soft)] overflow-x-auto"
    >
      <div className="w-full min-w-[640px] border-y border-[var(--mk-border)] grid grid-cols-[80px_1fr_1fr_80px]">
        <div className="border-r border-[var(--mk-border)] flex flex-col pt-20 gap-16 items-center text-[10px] text-[var(--mk-text-faint)] uppercase tracking-tighter">
          <span>[ Input ]</span>
          <div className="flex flex-col gap-24 pt-4">
            <span>[ Average ]</span>
            <span>[ Flat ]</span>
            <span>[ Blind ]</span>
          </div>
          <span className="mt-12">[ Outcome ]</span>
          <div className="mt-20 flex flex-col items-center">
            <span>[ s#!t ]</span>
            <span className="text-[12px] mt-1 italic text-center">
              Noise. <br /> No signal.
            </span>
          </div>
        </div>

        <div className="border-r border-[var(--mk-border)] p-8 lg:p-12">
          <div className="mb-12">
            <h3 className="text-[var(--mk-text)] text-[20px] italic font-sans font-bold uppercase tracking-tighter">
              Static dashboards
            </h3>
            <p className="text-[var(--mk-text-faint)] font-sans italic text-sm">
              Hard-coded rules. Yesterday&apos;s numbers.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-[var(--mk-text-muted)]">
              {">"} Who should we retain this week?
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--mk-text-faint)]">
                <span>✦</span> Calculating averages...
              </div>
              <div className="pl-4 border-l border-[var(--mk-border)] space-y-2">
                <span className="bg-[var(--mk-surface-2)] px-1.5 py-0.5 rounded border border-[var(--mk-border)] text-[9px] uppercase text-[var(--mk-text-faint)]">
                  No modeling
                </span>
                <p className="text-[var(--mk-text)]">
                  └ Recommendation: &quot;Send everyone a 10% coupon&quot;
                </p>
              </div>

              <div className="flex items-center gap-2 text-[var(--mk-text-faint)]">
                <span>✦</span> Why did they churn anyway?
              </div>
              <div className="pl-4 border-l border-[var(--mk-border)] space-y-2">
                <span className="bg-[var(--mk-surface-2)] px-1.5 py-0.5 rounded border border-[var(--mk-border)] text-[9px] uppercase text-rose-500">
                  Guess
                </span>
                <p className="text-[var(--mk-text)]">
                  └ &quot;Probably price. I&apos;m just a chart.&quot;
                </p>
              </div>
            </div>

            <div className="pt-8 opacity-30 grayscale pointer-events-none">
              <p>{">"} 80% of coupons went unused</p>
              <p>{">"} back to manual spreadsheets...</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 bg-[var(--mk-surface)]/50">
          <div className="mb-12">
            <h3 className="text-[var(--mk-text)] text-[20px] italic font-sans font-bold uppercase tracking-tighter">
              Entivia
            </h3>
            <p className="text-[var(--mk-text-faint)] font-sans italic text-sm">
              Know who&apos;s about to churn. Before they leave.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-[var(--mk-text-muted)]">
              {">"} Who should we retain this week?
            </p>

            <div className="flex items-center gap-2 text-[var(--mk-accent)]">
              <span className="w-2 h-2 rounded-full bg-[var(--mk-accent)] animate-pulse" />{" "}
              Reading live data...
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[var(--mk-accent-soft)] blur-2xl rounded-full -z-10" />
              <div className="bg-gradient-to-r from-[var(--mk-surface-2)] to-transparent p-6 border border-[var(--mk-border)] rounded-sm">
                <span className="bg-white text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  Live reasoning
                </span>
                <div className="mt-4 space-y-2">
                  <p className="text-[var(--mk-text)] font-bold">
                    └ Profiles built from your database:
                  </p>
                  <ul className="pl-4 space-y-1 text-[var(--mk-text-muted)]">
                    <li>
                      □ Mapping{" "}
                      <span className="text-[var(--mk-accent)]">
                        usage_drop
                      </span>{" "}
                      to churn risk
                    </li>
                    <li>
                      □ Weighting{" "}
                      <span className="text-[var(--mk-accent)]">
                        support_tickets
                      </span>
                    </li>
                    <li>
                      □ Scoring{" "}
                      <span className="text-[var(--mk-accent)]">
                        payment_delays
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[var(--mk-accent-soft)] text-[var(--mk-accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-[var(--mk-accent)]/30">
                  Tailored action
                </span>
                <p className="text-[var(--mk-text-faint)]">
                  └ Matched to this subscriber&apos;s pattern...
                </p>
              </div>

              <div className="text-[var(--mk-text)] border-l-2 border-emerald-500 pl-4 py-1">
                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">
                  Recommendation
                </span>
                <p className="text-[var(--mk-text)] mt-2">
                  └ &quot;Offer 7-day bundle — usage down 62% in 14 days.
                  Similar users accepted 71% of the time.&quot;
                </p>
              </div>

              <p className="text-[var(--mk-accent)] mt-8 italic">
                {">"} agreed. send offer to 89 accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="border-l border-[var(--mk-border)] flex flex-col pt-20 gap-16 items-center text-[10px] uppercase tracking-tighter">
          <span className="text-[var(--mk-text-faint)]">[ Input ]</span>

          <div className="flex flex-col items-center gap-2 mt-8">
            <span className="text-[var(--mk-accent)] font-bold">
              [ Live data ]
            </span>
            <span className="text-[12px] text-[var(--mk-text-faint)] text-center">
              Your <br /> database
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-24">
            <span className="text-[var(--mk-accent)] font-bold">
              [ Scored ]
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-20">
            <span className="text-[var(--mk-accent)] font-bold">
              [ Action ]
            </span>
            <span className="text-[12px] text-[var(--mk-text-faint)] text-center">
              Clear <br /> next step
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
