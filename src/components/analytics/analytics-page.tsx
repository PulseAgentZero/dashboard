"use client";

import { useState } from "react";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";
import { useAnalyticsRiskTrend, useAnalyticsSegments, useAnalyticsCohorts } from "@/hooks/analytics/use-analytics";

const PERIODS = ["7d", "30d", "90d"] as const;
type Period = (typeof PERIODS)[number];

function StatCard({ label, value, sub, color = "text-zinc-900" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-1.5 text-xl sm:text-2xl font-semibold font-mono tracking-tight ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-400 font-normal">{sub}</p>}
    </div>
  );
}

function BarChart({ data, height = 160 }: { data: number[]; height?: number }) {
  if (data.length === 0) return <div className="flex items-center justify-center text-xs text-zinc-400" style={{ height }}>No data</div>;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 w-full overflow-hidden" style={{ height }}>
      {data.map((v, i) => {
        const pct = (v / max) * 100;
        const color = v >= 70 ? "bg-rose-400" : v >= 40 ? "bg-amber-400" : "bg-emerald-400";
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end h-full group relative">
            <div className={`w-full rounded-t transition-all duration-300 ${color}`} style={{ height: `${Math.max(pct, 4)}%` }} />
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-zinc-400">{children}</p>;
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data: overview } = useDashboardOverview();
  const { data: trend } = useAnalyticsRiskTrend(period);
  const { data: segments } = useAnalyticsSegments();
  const { data: cohorts } = useAnalyticsCohorts(period);

  const trendPoints: number[] = (() => {
    if (!trend?.series?.length) return [];
    return trend.series.map((p) =>
      Math.round((p.avg_risk_score ?? 0) * 100),
    );
  })();

  const segList = (() => {
    if (!segments) return [];
    const raw = segments as Record<string, unknown>;
    const list = (raw.segments ?? raw.data ?? segments) as Array<Record<string, unknown>>;
    return Array.isArray(list) ? list : [];
  })();

  const cohortList = (() => {
    if (!cohorts) return [];
    const raw = cohorts as Record<string, unknown>;
    const list = (raw.cohorts ?? raw.data ?? cohorts) as Array<Record<string, unknown>>;
    return Array.isArray(list) ? list : [];
  })();

  return (
    <div className="mx-auto max-w-8xl space-y-4 sm:space-y-5">
      
      {/* Top Banner Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h1 className="text-xl font-medium text-zinc-900 tracking-tight">Analytics</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 font-normal leading-normal">
            Risk trends, segment breakdown, and cohort movement.
          </p>
        </div>
        <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg self-start sm:self-center">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                period === p 
                  ? "bg-white text-zinc-900 shadow-xs" 
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: High-level Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total entities" value={(overview?.total_entities ?? 0).toLocaleString()} sub="Profiled" />
        <StatCard label="High risk" value={(overview?.risk_distribution?.High ?? 0).toLocaleString()} sub="Need attention" color="text-rose-600" />
        <StatCard label="Active recs" value={(overview?.active_recommendations ?? 0).toLocaleString()} sub="Open queue" color="text-amber-600" />
        <StatCard
          label="Healthy"
          value={((overview?.risk_distribution?.Low ?? 0) + (overview?.risk_distribution?.Healthy ?? 0)).toLocaleString()}
          sub="Low + healthy"
          color="text-emerald-600"
        />
      </div>

      {/* Central Visual Trackers Section */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 sm:gap-5">
        {/* Trend Bar Graph */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 flex flex-col justify-between">
          <SectionLabel>Risk score trend · {period}</SectionLabel>
          <div className="mt-2">
            {trendPoints.length > 0 ? (
              <BarChart data={trendPoints} height={180} />
            ) : (
              <p className="py-12 text-center text-xs text-zinc-400">Run a pipeline to generate trend data.</p>
            )}
          </div>
        </div>

        {/* Global Distribution Component */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <SectionLabel>Risk distribution</SectionLabel>
          {overview?.risk_distribution ? (
            <div className="space-y-3.5 mt-2">
              {(["High", "Medium", "Low", "Healthy"] as const).map((tier) => {
                const count = overview.risk_distribution[tier] ?? 0;
                const total = Object.values(overview.risk_distribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                const bar = tier === "High" ? "bg-rose-500" : tier === "Medium" ? "bg-amber-500" : tier === "Low" ? "bg-emerald-500" : "bg-teal-500";
                return (
                  <div key={tier}>
                    <div className="mb-1.5 flex justify-between text-xs font-medium">
                      <span className="text-zinc-700">{tier}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">{count.toLocaleString()} · {pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-400">No data yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Segment and Cohort Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Segment Distribution */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <SectionLabel>Segments</SectionLabel>
          {segList.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-400">No segment data available. Run a pipeline first.</p>
          ) : (
            <div className="space-y-4 mt-2">
              {segList.slice(0, 6).map((seg, i) => {
                const name = String(seg.segment ?? seg.name ?? seg.label ?? `Segment ${i + 1}`);
                const count = Number(seg.entity_count ?? seg.count ?? 0);
                const risk = Number(seg.avg_risk_score ?? seg.risk_score ?? seg.risk ?? 0);
                const bar = risk >= 70 ? "bg-rose-400" : risk >= 40 ? "bg-amber-400" : "bg-emerald-400";
                return (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-medium gap-3">
                      <span className="truncate text-zinc-700 max-w-[50%] sm:max-w-[60%]">{name}</span>
                      <span className="shrink-0 text-zinc-400 font-mono text-[11px]">{count.toLocaleString()} · score {risk.toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${Math.min(risk, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cohort Flow List */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <SectionLabel>Cohorts · {period}</SectionLabel>
          {cohortList.length === 0 ? (
            <p className="py-12 text-center text-xs text-zinc-400">No cohort data available.</p>
          ) : (
            <div className="space-y-2 mt-2">
              {cohortList.slice(0, 5).map((c, i) => {
                const name = String(c.name ?? c.label ?? c.cohort ?? `Cohort ${i + 1}`);
                const count = Number(c.entity_count ?? c.count ?? c.size ?? 0);
                const change = c.change_pct ?? c.change ?? null;
                const positive = Number(change) >= 0;
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-100/60 px-3 py-2.5">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-medium text-zinc-800 truncate">{name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{count.toLocaleString()} entities</p>
                    </div>
                    {change != null && (
                      <span className={`text-xs font-medium font-mono shrink-0 ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                        {positive ? "+" : ""}{Number(change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}