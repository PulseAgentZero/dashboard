"use client";

import { Infinity } from "lucide-react";
import type { MeterDef } from "@/lib/usage-meters";
import { getMeterPercent, getMeterStatus } from "@/lib/usage-meters";
import type { UsageSlot } from "@/lib/api/usage-api";

const STATUS_STYLES = {
  unlimited: {
    ring: "stroke-emerald-500",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
    label: "Unlimited",
    bar: "bg-emerald-500",
  },
  healthy: {
    ring: "stroke-blue-500",
    bg: "bg-blue-50",
    badge: "bg-slate-100 text-slate-600",
    label: "Healthy",
    bar: "bg-blue-500",
  },
  warning: {
    ring: "stroke-amber-500",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    label: "High usage",
    bar: "bg-amber-500",
  },
  critical: {
    ring: "stroke-rose-500",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-800",
    label: "At limit",
    bar: "bg-rose-500",
  },
};

function RingChart({ pct, strokeClass }: { pct: number; strokeClass: string }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <svg width="76" height="76" className="-rotate-90 shrink-0">
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        className="text-slate-100"
      />
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className={strokeClass}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

type Props = {
  meter: MeterDef;
  slot: UsageSlot | undefined;
};

export function UsageMeterCard({ meter, slot }: Props) {
  const status = getMeterStatus(slot);
  const styles = STATUS_STYLES[status];
  const pct = getMeterPercent(slot);
  const Icon = meter.icon;
  const used = slot?.used ?? 0;
  const limit = slot?.limit;

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${styles.bg}`}>
          <Icon size={17} className={meter.color} />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-900">{meter.label}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        {meter.period === "monthly"
          ? "Resets monthly"
          : meter.period === "daily"
            ? "Resets daily"
            : "Active resources"}
      </p>

      <div className="mt-4 flex items-center gap-3">
        {status === "unlimited" ? (
          <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <Infinity size={26} className="text-emerald-600" />
          </div>
        ) : (
          <div className="relative shrink-0">
            <RingChart pct={pct} strokeClass={styles.ring} />
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-slate-900">
              {pct}%
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {status === "unlimited" ? (
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {used.toLocaleString()}
              <span className="ml-1 text-sm font-medium text-slate-400">in use</span>
            </p>
          ) : (
            <>
              <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                {used.toLocaleString()}
                <span className="text-base font-semibold text-slate-400">
                  {" "}/ {limit != null ? limit.toLocaleString() : "—"}
                </span>
              </p>
              {limit != null && (
                <p className="mt-1 text-xs text-slate-500">
                  {Math.max(limit - used, 0).toLocaleString()} remaining
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {status !== "unlimited" && limit != null && limit > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] font-medium text-slate-500">
            <span>Consumption</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
