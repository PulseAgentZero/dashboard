"use client";

import { useState } from "react";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";
import { useAnalyticsRiskTrend, useAnalyticsSegments, useAnalyticsCohorts } from "@/hooks/analytics/use-analytics";

const PERIODS = ["7d", "30d", "90d"] as const;
type Period = (typeof PERIODS)[number];

function StatCard({ label, value, sub, color = "text-slate-900" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function BarChart({ data, height = 160 }: { data: number[]; height?: number }) {
  if (data.length === 0) return <div className="flex items-center justify-center text-xs text-slate-400" style={{ height }}>No data</div>;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => {
        const pct = (v / max) * 100;
        const color = v >= 70 ? "bg-rose-400" : v >= 40 ? "bg-amber-400" : "bg-emerald-400";
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <div className={`w-full rounded-t transition-all ${color}`} style={{ height: `${Math.max(pct, 3)}%` }} />
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</p>;
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data: overview } = useDashboardOverview();
  const { data: trend, isError: trendError } = useAnalyticsRiskTrend(period);
  const { data: segments, isError: segError } = useAnalyticsSegments();
  const { data: cohorts, isError: cohortError } = useAnalyticsCohorts(period);

  const hasGate = trendError || segError || cohortError;

  const trendPoints: number[] = (() => {
    if (trendError || !trend) return [];
    const raw = trend as Record<string, unknown>;
    const points = (raw.points ?? raw.data ?? raw.trend ?? []) as Array<Record<string, unknown>>;
    return Array.isArray(points) ? points.map((p) => Number(p.avg_risk_score ?? p.risk_score ?? p.value ?? 0)) : [];
  })();

  const segList = (() => {
    if (segError || !segments) return [];
    const raw = segments as Record<string, unknown>;
    const list = (raw.segments ?? raw.data ?? segments) as Array<Record<string, unknown>>;
    return Array.isArray(list) ? list : [];
  })();

  const cohortList = (() => {
    if (cohortError || !cohorts) return [];
    const raw = cohorts as Record<string, unknown>;
    const list = (raw.cohorts ?? raw.data ?? cohorts) as Array<Record<string, unknown>>;
    return Array.isArray(list) ? list : [];
  })();

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Risk trends, segment breakdown, and cohort movement.
            {hasGate && (
              <span className="ml-2 rounded-full bg-amber-50 px-2 py-px text-[10px] font-semibold text-amber-600">
                Requires advanced analytics plan
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                period === p ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SectionLabel>Risk score trend · {period}</SectionLabel>
          {trendError ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-medium text-slate-500">Advanced analytics not available on this plan.</p>
              <p className="mt-1 text-xs text-slate-400">Upgrade to unlock trend data.</p>
            </div>
          ) : trendPoints.length > 0 ? (
            <BarChart data={trendPoints} height={180} />
          ) : (
            <p className="py-10 text-center text-xs text-slate-400">Run a pipeline to generate trend data.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SectionLabel>Risk distribution</SectionLabel>
          {overview?.risk_distribution ? (
            <div className="space-y-3">
              {(["High", "Medium", "Low", "Healthy"] as const).map((tier) => {
                const count = overview.risk_distribution[tier] ?? 0;
                const total = Object.values(overview.risk_distribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                const bar = tier === "High" ? "bg-rose-500" : tier === "Medium" ? "bg-amber-400" : tier === "Low" ? "bg-emerald-400" : "bg-teal-400";
                return (
                  <div key={tier}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{tier}</span>
                      <span className="text-slate-400">{count.toLocaleString()} · {pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No data yet.</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SectionLabel>Segments</SectionLabel>
          {segError ? (
            <p className="py-6 text-center text-xs text-slate-400">Segment breakdown requires advanced analytics.</p>
          ) : segList.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No segment data available. Run a pipeline first.</p>
          ) : (
            <div className="space-y-3">
              {segList.slice(0, 8).map((seg, i) => {
                const name = String(seg.segment ?? seg.name ?? seg.label ?? `Segment ${i + 1}`);
                const count = Number(seg.entity_count ?? seg.count ?? 0);
                const risk = Number(seg.avg_risk_score ?? seg.risk_score ?? seg.risk ?? 0);
                const bar = risk >= 70 ? "bg-rose-400" : risk >= 40 ? "bg-amber-400" : "bg-emerald-400";
                return (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="max-w-[60%] truncate font-medium text-slate-700">{name}</span>
                      <span className="shrink-0 text-slate-400">{count.toLocaleString()} · score {risk.toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${Math.min(risk, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SectionLabel>Cohorts · {period}</SectionLabel>
          {cohortError ? (
            <p className="py-6 text-center text-xs text-slate-400">Cohort data requires advanced analytics.</p>
          ) : cohortList.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No cohort data available.</p>
          ) : (
            <div className="space-y-2">
              {cohortList.slice(0, 6).map((c, i) => {
                const name = String(c.name ?? c.label ?? c.cohort ?? `Cohort ${i + 1}`);
                const count = Number(c.entity_count ?? c.count ?? c.size ?? 0);
                const change = c.change_pct ?? c.change ?? null;
                const positive = Number(change) >= 0;
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-slate-800">{name}</p>
                      <p className="text-[10px] text-slate-400">{count.toLocaleString()} entities</p>
                    </div>
                    {change != null && (
                      <span className={`text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
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
