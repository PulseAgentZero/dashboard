"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Minus,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";
import type { DashboardOverview } from "@/types/dashboard";

type MetricItem = {
  label: string;
  value: string;
  detail: string;
  change: number | null;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
};

function buildMetrics(d: DashboardOverview): MetricItem[] {
  return [
    {
      label: "Entities modeled",
      value: d.total_entities.toLocaleString(),
      detail: "Total profiled across all segments",
      change: d.total_entities_change_pct ?? null,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      label: "High-risk entities",
      value: d.risk_distribution.High.toLocaleString(),
      detail: `${d.risk_distribution.Medium} medium · ${d.risk_distribution.Low + d.risk_distribution.Healthy} safe`,
      change: d.high_risk_change_pct ?? null,
      icon: AlertTriangle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
    },
    {
      label: "Open recommendations",
      value: d.active_recommendations.toLocaleString(),
      detail: `${d.critical_recommendations} critical · ranked by urgency`,
      change: null,
      icon: Target,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Last pipeline",
      value: d.last_pipeline_run
        ? `${(d.last_pipeline_run.entities_scored ?? 0).toLocaleString()} scored`
        : "No runs yet",
      detail: d.last_pipeline_run
        ? `Status: ${d.last_pipeline_run.status}`
        : "Trigger a run to start profiling",
      change: null,
      icon: Zap,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];
}

function TrendBadge({ change }: { change: number | null }) {
  if (change === null) return null;
  const isUp = change > 0;
  const isZero = change === 0;
  const Icon = isZero ? Minus : isUp ? ArrowUp : ArrowDown;
  const color = isZero
    ? "text-slate-500"
    : isUp
      ? "text-rose-600"
      : "text-emerald-600";
  const bg = isZero
    ? "bg-slate-100"
    : isUp
      ? "bg-rose-50"
      : "bg-emerald-50";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${color} ${bg}`}>
      <Icon size={11} />
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-9 w-9 rounded-lg bg-slate-100" />
        <div className="h-5 w-14 rounded-md bg-slate-100" />
      </div>
      <div className="mt-4 h-7 w-20 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-36 rounded bg-slate-100" />
    </div>
  );
}

function MetricCard({ m }: { m: MetricItem }) {
  const Icon = m.icon;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${m.iconBg}`}>
          <Icon size={17} className={m.iconColor} />
        </div>
        <TrendBadge change={m.change} />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {m.value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500">{m.label}</p>
      <p className="mt-1 text-xs text-slate-400">{m.detail}</p>
    </div>
  );
}

export function MetricsGrid() {
  const { data, isLoading, isError } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-3">
        {isError && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Could not load dashboard metrics. Check that the API is running and{" "}
            <code className="text-xs">NEXT_PUBLIC_API_URL</code> points to it.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["Entities modeled", "High-risk entities", "Open recommendations", "Last pipeline"].map(
          (label) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">—</p>
            </div>
          ),
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {buildMetrics(data).map((m) => <MetricCard key={m.label} m={m} />)}
    </div>
  );
}
