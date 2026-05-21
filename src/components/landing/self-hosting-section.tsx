import Link from "next/link";
import { ArrowRight, ArrowUpRight, Cloud, Database, Lock } from "lucide-react";

const POINTS = [
  "Read-only database users",
  "Encrypted credentials",
  "Bring your own LLM keys",
  "Pipeline traffic stays internal",
];

export default function SelfHostingSection() {
  return (
    <section
      data-navbar-theme="dark"
      className="relative overflow-hidden border-y border-[var(--mk-border)] bg-[var(--mk-bg)] px-6 py-24 md:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, var(--mk-accent-soft), transparent 55%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        {/* Left: copy */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
            <Lock size={12} /> Self-hosted
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--mk-text)] sm:text-4xl md:text-5xl leading-[1.05]">
            Sensitive data?
            <br />
            Run Entivia in your VPC.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--mk-text-muted)] sm:text-base">
            Your customer, patient, or financial records never leave your
            environment. Entivia runs next to your database — not in our cloud.
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 max-w-md">
            {POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-sm text-[var(--mk-text-muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mk-accent)]" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/hosting/self-hosted"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--mk-accent)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--mk-accent-hover)]"
              style={{ boxShadow: "0 4px 24px var(--mk-accent-ring)" }}
            >
              Self-hosting guide
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] px-6 py-3 text-sm font-medium text-[var(--mk-text-muted)] transition-colors hover:border-[var(--mk-accent)] hover:text-[var(--mk-text)]"
            >
              Talk to us
            </Link>
          </div>
        </div>

        {/* Right: architecture visual */}
        <div className="relative">
          <style>{`
            @keyframes mkPulse {
              0%, 100% { opacity: 0.4; }
              50%       { opacity: 1; }
            }
            .mk-pulse { animation: mkPulse 2.2s ease-in-out infinite; }

            @keyframes mkDash {
              to { stroke-dashoffset: -16; }
            }
            .mk-flow { stroke-dasharray: 4 4; animation: mkDash 1.4s linear infinite; }
          `}</style>

          <div className="rounded-3xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6 sm:p-8">
            {/* "Your environment" boundary */}
            <div className="relative rounded-2xl border-2 border-dashed border-[var(--mk-accent)]/40 bg-[var(--mk-bg)] p-6">
              <div className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--mk-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--mk-accent)]">
                <span className="mk-pulse h-1.5 w-1.5 rounded-full bg-[var(--mk-accent)]" />
                Your environment
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--mk-border)] bg-[var(--mk-surface-2)] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mk-accent-soft)] text-[var(--mk-accent)]">
                      <Database size={16} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--mk-text)]">
                      Your database
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--mk-text-faint)]">
                    Postgres · MySQL · MSSQL
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--mk-accent)]/30 bg-[var(--mk-accent-soft)] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mk-accent)] text-white">
                      <Lock size={16} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--mk-text)]">
                      Entivia
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--mk-text-faint)]">
                    Runs via Docker Compose
                  </p>
                </div>
              </div>

              {/* Internal connection */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <svg width="120" height="14" viewBox="0 0 120 14" fill="none">
                  <line
                    x1="0"
                    y1="7"
                    x2="120"
                    y2="7"
                    stroke="var(--mk-accent)"
                    strokeWidth="2"
                    className="mk-flow"
                  />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
                  Internal SQL
                </span>
              </div>
            </div>

            {/* Outbound */}
            <div className="mt-5 flex items-start gap-4">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg)] px-4 py-3">
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-[var(--mk-text-faint)]"
                />
                <span className="font-mono text-[11px] text-[var(--mk-text-muted)]">
                  Prompt + metadata only
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg)] px-4 py-3">
                <Cloud size={14} className="text-[var(--mk-text-faint)]" />
                <span className="text-xs font-semibold text-[var(--mk-text-muted)]">
                  LLM API
                </span>
              </div>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
              Your row data never leaves
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
