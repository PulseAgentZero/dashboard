import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      data-navbar-theme="dark"
      className="relative overflow-hidden bg-[var(--mk-surface)] px-4 py-28 md:px-10 lg:px-28"
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-[var(--mk-accent)]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
          Get started
        </span>
        <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[var(--mk-text)] md:text-6xl">
          Your data is ready.
          <br />
          Are you?
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[var(--mk-text-muted)] max-w-xl mx-auto">
          Connect your database, describe your business, and Entivia starts scoring
          and recommending in minutes — not months.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/signup"
            className="rounded-full bg-[var(--mk-accent)] px-8 py-4 font-mono font-bold uppercase tracking-wider text-sm text-white shadow-lg shadow-[var(--mk-accent)]/20 hover:bg-[var(--mk-accent-hover)] transition-all active:scale-[0.98]"
          >
            Get started free
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-[var(--mk-border)] px-8 py-4 font-mono font-bold uppercase tracking-wider text-sm text-[var(--mk-text-muted)] hover:border-[var(--mk-text-faint)] hover:text-[var(--mk-text)] transition-all"
          >
            Read the docs
          </Link>
        </div>

        <p className="mt-6 text-xs text-[var(--mk-text-faint)]">
          Free plan forever · No credit card required · Self-host on MIT
        </p>
      </div>
    </section>
  );
}
