"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Infinity,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useUsage } from "@/hooks/usage/use-usage";
import { useConnections } from "@/hooks/connections/use-connections";
import type { PlanUsage } from "@/lib/api/usage-api";
import { UsageMeterCard } from "@/components/usage/usage-meter-card";
import { UsageOverviewChart } from "@/components/usage/usage-overview-chart";
import {
  USAGE_METERS,
  METER_GROUPS,
  buildChartData,
  computeHealthScore,
  getMeterStatus,
  sortMetersBySeverity,
  summarizeMeterStatuses,
} from "@/lib/usage-meters";
import { isUnlimitedPlan, planDisplayName } from "@/lib/plan-utils";

function withConnectionsLimit(
  usage: PlanUsage,
  connectionCount: number,
  unlimited: boolean,
): PlanUsage["limits"] {
  const existing = usage.limits.connections;
  const connections = {
    used: connectionCount,
    limit: unlimited ? null : (existing?.limit ?? 5),
  };
  return { ...usage.limits, connections };
}

function SummaryPill({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "default" | "success" | "warning" | "danger";
}) {
  const accentCls = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-rose-200 bg-rose-50/50",
  }[accent ?? "default"];
  const valueCls = {
    default: "text-slate-900",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
  }[accent ?? "default"];

  return (
    <div className={`min-w-[120px] flex-1 rounded-xl border px-4 py-3 shadow-sm ${accentCls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${valueCls}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

export function UsagePage() {
  const { org } = useAuth();
  const { data: usage, isLoading, isError } = useUsage();
  const { data: connections } = useConnections();

  const plan = usage?.plan ?? org?.plan ?? "free";
  const unlimited = isUnlimitedPlan(plan);

  const limits = useMemo(() => {
    if (!usage) return undefined;
    return withConnectionsLimit(usage, connections?.length ?? 0, unlimited);
  }, [usage, connections?.length, unlimited]);

  const health = limits ? computeHealthScore(limits) : 0;
  const chartData = limits ? buildChartData(limits) : [];
  const statusSummary = limits ? summarizeMeterStatuses(limits) : null;

  const atRiskCount = statusSummary
    ? statusSummary.warning + statusSummary.critical
    : 0;

  const atRisk =
    limits &&
    USAGE_METERS.some((m) => {
      const s = getMeterStatus(limits[m.key]);
      return s === "critical" || s === "warning";
    });

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Activity size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Workspace
            </p>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Usage</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Track consumption across connections, automation, and Studio. Upgrade on the plan page
            when you need higher quotas.
          </p>
        </div>
        <Link
          href="/dashboard/plan"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Gauge size={16} className="text-indigo-600" />
          View plan & billing
          <ArrowRight size={14} />
        </Link>
      </div>

      {isError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not load usage data. Try refreshing the page.
        </p>
      )}

      {!isLoading && limits && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryPill
            label="Current plan"
            value={plan.charAt(0).toUpperCase() + plan.slice(1)}
            sub={
              unlimited
                ? "Unlimited quotas"
                : `${planDisplayName(plan)} plan limits on key meters`
            }
            accent={unlimited ? "success" : "default"}
          />
          <SummaryPill
            label="Capacity headroom"
            value={`${health}%`}
            sub={
              unlimited
                ? "Pro plan — no hard caps"
                : "Average room left on limited meters"
            }
            accent={health >= 50 ? "success" : health >= 25 ? "warning" : "danger"}
          />
          <SummaryPill
            label="Needs attention"
            value={String(atRiskCount)}
            sub={
              atRiskCount === 0
                ? "All meters look healthy"
                : "High usage or at limit"
            }
            accent={atRiskCount === 0 ? "success" : atRiskCount > 0 ? "danger" : "default"}
          />
          <SummaryPill
            label="Unlimited meters"
            value={String(statusSummary?.unlimited ?? 0)}
            sub={`of ${USAGE_METERS.length} tracked resources`}
            accent="default"
          />
        </div>
      )}

      {atRisk && !unlimited && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-orange-50/80 to-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100">
              <AlertTriangle size={20} className="text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">
                {atRiskCount} meter{atRiskCount === 1 ? "" : "s"} need attention
              </p>
              <p className="mt-0.5 text-sm text-rose-700/90">
                Upgrade to Pro for unlimited quotas, or free up resources on affected meters.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/plan"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Upgrade plan
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Limit overview</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Used vs maximum for resources with a finite cap
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600">
                {plan} plan
              </span>
            </div>
            {isLoading ? (
              <div className="h-[280px] animate-pulse rounded-xl bg-slate-100" />
            ) : chartData.length > 0 ? (
              <UsageOverviewChart data={chartData} />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-center">
                <Infinity size={32} className="text-emerald-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">All meters unlimited</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Your plan does not cap any tracked resources. Usage still appears in the
                  breakdown below.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp size={14} />
              <p className="text-xs font-semibold uppercase tracking-widest">Headroom</p>
            </div>
            {isLoading ? (
              <div className="mt-6 flex-1 animate-pulse rounded-lg bg-slate-700" />
            ) : (
              <>
                <p className="mt-4 text-5xl font-bold tracking-tight tabular-nums">{health}%</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {unlimited
                    ? "Pro includes unlimited quotas on every meter in your workspace."
                    : "Higher is better — average spare capacity across limited resources."}
                </p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-700"
                    style={{ width: `${health}%` }}
                  />
                </div>
                {!unlimited && statusSummary && (
                  <ul className="mt-5 space-y-2 text-xs text-slate-400">
                    <li className="flex justify-between">
                      <span>Healthy</span>
                      <span className="font-semibold text-slate-200">
                        {statusSummary.healthy}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>High usage</span>
                      <span className="font-semibold text-amber-300">
                        {statusSummary.warning}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>At limit</span>
                      <span className="font-semibold text-rose-300">
                        {statusSummary.critical}
                      </span>
                    </li>
                    <li className="flex justify-between border-t border-slate-700 pt-2">
                      <span>Unlimited</span>
                      <span className="font-semibold text-emerald-300">
                        {statusSummary.unlimited}
                      </span>
                    </li>
                  </ul>
                )}
              </>
            )}
            <Link
              href="/dashboard/plan"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              <Sparkles size={14} className="text-indigo-600" />
              Manage plan
            </Link>
          </div>
        </div>
      </div>

      {METER_GROUPS.map((group) => {
        const meters = sortMetersBySeverity(
          USAGE_METERS.filter((m) => m.group === group.id),
          limits ?? ({} as PlanUsage["limits"]),
        );
        const groupAtRisk = limits
          ? meters.filter((m) => {
              const s = getMeterStatus(limits[m.key]);
              return s === "warning" || s === "critical";
            }).length
          : 0;

        return (
          <section
            key={group.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{group.title}</h2>
                <p className="text-sm text-slate-500">{group.description}</p>
              </div>
              {!isLoading && groupAtRisk > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                  {groupAtRisk} need attention
                </span>
              )}
            </div>
            <div className="p-5">
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {meters.map((m) => (
                    <div key={m.key} className="h-44 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : limits ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {meters.map((m) => (
                    <UsageMeterCard key={m.key} meter={m} slot={limits[m.key]} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
