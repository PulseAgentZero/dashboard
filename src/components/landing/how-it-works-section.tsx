import { HOW_IT_WORKS_STEPS } from "@/lib/marketing/features";

export default function HowItWorksSection() {
  return (
    <section
      data-navbar-theme="dark"
      className="bg-[var(--mk-bg)] px-4 py-24 md:px-10 lg:px-28"
    >
      <div className="mb-16 max-w-xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
          How it works
        </span>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-[var(--mk-text)] md:text-5xl">
          From data to action
          <br />
          in minutes.
        </h2>
        <p className="mt-4 text-base text-[var(--mk-text-muted)] leading-relaxed">
          No engineers. No data science team. Just connect and go.
        </p>
      </div>

      <div className="relative">
        {/* connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-[var(--mk-border)] hidden md:block" />

        <div className="grid gap-8 md:gap-0">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.step} className="relative flex gap-8 md:pb-10 last:pb-0">
              {/* step number bubble */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] text-[11px] font-black font-mono text-[var(--mk-accent)]">
                {step.step}
              </div>

              <div className="flex-1 pt-2.5">
                <h3 className="text-xl font-black text-[var(--mk-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--mk-text-muted)] max-w-md">
                  {step.description}
                </p>

                {/* inline visual hint per step */}
                {i === 0 && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--mk-border)] bg-[var(--mk-surface)] px-4 py-2.5 text-sm text-[var(--mk-text-muted)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--mk-accent)] animate-pulse" />
                    <span className="font-mono text-xs">
                      &quot;We&apos;re a telecom. Entities are subscribers. Risk means churn.&quot;
                    </span>
                  </div>
                )}
                {i === 1 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["PostgreSQL", "MySQL", "MSSQL", "SQLite", "CSV/Excel"].map((db) => (
                      <span
                        key={db}
                        className="rounded-lg border border-[var(--mk-border)] bg-[var(--mk-surface)] px-3 py-1 text-[11px] font-semibold text-[var(--mk-text-muted)]"
                      >
                        {db}
                      </span>
                    ))}
                  </div>
                )}
                {i === 2 && (
                  <div className="mt-4 flex gap-3">
                    {[
                      { label: "12,400", sub: "Entities scored" },
                      { label: "91", sub: "Max risk score" },
                      { label: "89", sub: "Actions queued" },
                    ].map((stat) => (
                      <div
                        key={stat.sub}
                        className="rounded-xl border border-[var(--mk-border)] bg-[var(--mk-surface)] px-4 py-2.5 text-center"
                      >
                        <p className="font-mono text-lg font-black text-[var(--mk-accent)]">
                          {stat.label}
                        </p>
                        <p className="text-[10px] text-[var(--mk-text-faint)]">{stat.sub}</p>
                      </div>
                    ))}
                  </div>
                )}
                {i === 3 && (
                  <div className="mt-4 rounded-xl border border-[var(--mk-border)] bg-[var(--mk-surface)] px-4 py-3 max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Critical
                      </span>
                      <span className="font-mono text-[9px] text-[var(--mk-text-faint)]">
                        Just now
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--mk-text)]">
                      Offer 7-day bundle to Amina B.
                    </p>
                    <p className="mt-1 text-xs text-[var(--mk-text-muted)]">
                      71% accept rate on similar profiles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
