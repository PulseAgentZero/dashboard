"use client";

import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

const tiers = [
  { key: "High", label: "High risk", color: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
  { key: "Medium", label: "Medium risk", color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  { key: "Low", label: "Low risk", color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { key: "Healthy", label: "Healthy", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
] as const;

export function RiskBreakdown() {
  const { data, isLoading } = useDashboardOverview();

  const dist = data?.risk_distribution;
  const total = dist
    ? dist.High + dist.Medium + dist.Low + dist.Healthy
    : 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="mb-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
          Risk overview
        </p>
        <h2 className="mt-0.5 text-base font-medium text-zinc-900">
          Distribution by tier
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {tiers.map((t) => (
            <div key={t.key} className="animate-pulse space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-20 rounded bg-zinc-100" />
                <div className="h-3.5 w-12 rounded bg-zinc-100" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100" />
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
                <div key={t.key} className="group">
                  <div className="mb-1.5 flex items-center justify-between text-xs sm:text-sm gap-2">
                    {/* Tier Name Column */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${t.color}`} />
                      <span className="font-medium text-zinc-700 truncate">{t.label}</span>
                    </div>
                    
                    {/* Analytics Metrics Column */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium font-mono ${t.text} ${t.bg}`}>
                        {count.toLocaleString()}
                      </span>
                      <span className="w-9 text-right text-xs font-medium text-zinc-400 font-mono">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Clean Visual Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ease-out ${t.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {total > 0 && (
            <div className="mt-5 border-t border-zinc-100 pt-4">
              <p className="text-xs text-zinc-400 font-normal">
                {total.toLocaleString()} entities profiled total
              </p>
            </div>
          )}

          {total === 0 && (
            <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-center border border-zinc-100">
              <p className="text-xs sm:text-sm text-zinc-500 leading-normal">
                No entities profiled yet. Run a pipeline to see risk breakdown.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}