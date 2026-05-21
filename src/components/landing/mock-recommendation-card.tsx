import type { IndustrySolution } from "@/lib/marketing/industries";

const URGENCY_STYLES = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  medium: "bg-orange-500/15 text-orange-400 border-orange-500/25",
} as const;

export function MockRecommendationCard({
  action,
  className = "",
}: {
  action: IndustrySolution["sampleAction"];
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-5 shadow-lg shadow-black/20",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            URGENCY_STYLES[action.urgency],
          ].join(" ")}
        >
          {action.urgency}
        </span>
        <span className="font-mono text-[10px] text-[var(--mk-text-faint)]">
          Just now
        </span>
      </div>
      <p className="mt-4 text-xs text-[var(--mk-text-muted)]">{action.entity}</p>
      <p className="mt-2 text-base font-semibold text-[var(--mk-text)]">
        {action.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--mk-text-muted)]">
        {action.detail}
      </p>
      <div className="mt-4 flex gap-2">
        <span className="rounded-lg bg-[var(--mk-accent)] px-3 py-1.5 text-xs font-semibold text-white">
          Take action
        </span>
        <span className="rounded-lg border border-[var(--mk-border)] px-3 py-1.5 text-xs text-[var(--mk-text-muted)]">
          Dismiss
        </span>
      </div>
    </div>
  );
}
