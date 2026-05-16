"use client";

import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

const tiers = [
  { key: "High", label: "High risk", color: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
  { key: "Medium", label: "Medium risk", color: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  { key: "Low", label: "Low risk", color: "bg-blue-400", text: "text-blue-700", bg: "bg-blue-50" },
  { key: "Healthy", label: "Healthy", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
] as const;

export function RiskBreakdown() {
  const { data, isLoading } = useDashboardOverview();

  const dist = data?.risk_distribution;
  const total = dist
    ? dist.High + dist.Medium + dist.Low + dist.Healthy
    : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Risk overview
        </p>
        <h2 className="mt-1 text-base font-semibold text-slate-900">
          Distribution by tier
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {tiers.map((t) => (
            <div key={t.key} className="animate-pulse space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3.5 w-24 rounded bg-slate-100" />
                <div className="h-3.5 w-8 rounded bg-slate-100" />
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {tiers.map((t) => {
              const count = dist?.[t.key] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={t.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${t.color}`} />
                      <span className="font-medium text-slate-700">{t.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${t.text} ${t.bg}`}>
                        {count.toLocaleString()}
                      </span>
                      <span className="w-10 text-right text-xs text-slate-400">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${t.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {total > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                {total.toLocaleString()} entities profiled total
              </p>
            </div>
          )}

          {total === 0 && (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">
                No entities profiled yet. Run a pipeline to see risk breakdown.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
