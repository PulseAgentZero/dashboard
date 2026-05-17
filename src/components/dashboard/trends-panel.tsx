"use client";

import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

const FALLBACK = [38, 44, 41, 52, 56, 49, 63, 68, 65, 73, 81, 76];

export function TrendsPanel() {
  const { data, isLoading, isError } = useDashboardOverview();

  const raw: number[] = data?.risk_trend?.length
    ? data.risk_trend.map((p) => Math.round((p.avg_risk_score ?? 0) * 100))
    : FALLBACK;

  const max = Math.max(...raw, 1);
  const peak = Math.max(...raw);
  const last = raw[raw.length - 1] ?? 0;
  const first = raw[0] ?? 0;
  const change = raw.length > 1 ? last - first : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Analytics
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">
            Risk score trend
          </h2>
        </div>
        {isError && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-400">
            Demo data
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-44 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <div className="flex h-44 items-end gap-1 rounded-lg bg-slate-50 px-3 pb-3 pt-4">
          {raw.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <div
                className="rounded-sm bg-blue-500 transition-all duration-300"
                style={{ height: `${(v / max) * 100}%` }}
                title={`${v}%`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Peak", value: `${peak}%`, color: "text-slate-900" },
          {
            label: "30d change",
            value: change === 0 ? "—" : `${change > 0 ? "+" : ""}${change}%`,
            color: change > 0 ? "text-rose-600" : change < 0 ? "text-emerald-600" : "text-slate-500",
          },
          {
            label: "Data points",
            value: raw.length.toString(),
            color: "text-slate-900",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] text-slate-400">{label}</p>
            <p className={`mt-0.5 text-sm font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
