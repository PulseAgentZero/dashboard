"use client";

import Link from "next/link";
import { Activity, ArrowRight, Gauge } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useUsage } from "@/hooks/usage/use-usage";
import { UsageMeterCard } from "@/components/usage/usage-meter-card";
import { UsageOverviewChart } from "@/components/usage/usage-overview-chart";
import {
  USAGE_METERS,
  METER_GROUPS,
  buildChartData,
  computeHealthScore,
  getMeterStatus,
} from "@/lib/usage-meters";

export function UsagePage() {
  const { org } = useAuth();
  const { data: usage, isLoading, isError } = useUsage();

  const plan = usage?.plan ?? org?.plan ?? "free";
  const isPro = plan.toLowerCase() === "pro";
  const health = usage ? computeHealthScore(usage.limits) : 0;
  const chartData = usage ? buildChartData(usage.limits) : [];

  const atRisk =
    usage &&
    USAGE_METERS.some((m) => {
      const s = getMeterStatus(usage.limits[m.key]);
      return s === "critical" || s === "warning";
    });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <Activity size={18} />
            <p className="text-xs font-semibold uppercase tracking-wide">Workspace</p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Usage</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Monitor consumption across API, automation, and Studio. Limits and billing live on
            your plan page.
          </p>
        </div>
        <Link
          href="/dashboard/plan"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
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

      {atRisk && !isPro && (
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-6 py-4">
          <p className="text-sm font-semibold text-rose-900">
            You&apos;re approaching or at plan limits
          </p>
          <p className="mt-1 text-sm text-rose-700/90">
            Upgrade to Pro for unlimited quotas, or free resources on affected meters.
          </p>
          <Link
            href="/dashboard/plan"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-800 hover:underline"
          >
            Go to checkout
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Limit overview</h2>
              <p className="text-xs text-slate-500">Used vs plan maximum (limited resources)</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-600">
              {plan} plan
            </span>
          </div>
          {isLoading ? (
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <UsageOverviewChart data={chartData} />
          )}
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Capacity headroom
          </p>
          {isLoading ? (
            <div className="mt-6 h-24 animate-pulse rounded-lg bg-slate-700" />
          ) : (
            <>
              <p className="mt-4 text-5xl font-bold tracking-tight">{health}%</p>
              <p className="mt-2 text-sm text-slate-400">
                {isPro
                  ? "Pro includes unlimited quotas on all meters."
                  : "Average remaining capacity across limited resources."}
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-700"
                  style={{ width: `${health}%` }}
                />
              </div>
            </>
          )}
          <Link
            href="/dashboard/plan"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Manage plan
          </Link>
        </div>
      </div>

      {METER_GROUPS.map((group) => {
        const meters = USAGE_METERS.filter((m) => m.group === group.id);
        return (
          <section key={group.id}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{group.title}</h2>
              <p className="text-sm text-slate-500">{group.description}</p>
            </div>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {meters.map((m) => (
                  <div key={m.key} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : usage ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {meters.map((m) => (
                  <UsageMeterCard key={m.key} meter={m} slot={usage.limits[m.key]} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
