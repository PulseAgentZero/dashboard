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
  },
  healthy: {
    ring: "stroke-blue-500",
    bg: "bg-blue-50",
    badge: "bg-slate-100 text-slate-600",
    label: "Healthy",
  },
  warning: {
    ring: "stroke-amber-500",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    label: "High usage",
  },
  critical: {
    ring: "stroke-rose-500",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-800",
    label: "At limit",
  },
};

function RingChart({ pct, strokeClass }: { pct: number; strokeClass: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <svg width="88" height="88" className="-rotate-90">
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-slate-100"
      />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        strokeWidth="8"
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

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${styles.bg}`}>
          <Icon size={18} className={meter.color} />
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}>
          {styles.label}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative shrink-0">
          {status === "unlimited" ? (
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-emerald-50">
              <Infinity size={28} className="text-emerald-600" />
            </div>
          ) : (
            <>
              <RingChart pct={pct} strokeClass={styles.ring} />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
                {pct}%
              </span>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{meter.label}</p>
          <p className="mt-0.5 text-xs text-slate-500 capitalize">
            {meter.period === "monthly"
              ? "Resets monthly"
              : meter.period === "daily"
                ? "Resets daily"
                : "Active resources"}
          </p>
          {status === "unlimited" ? (
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {(slot?.used ?? 0).toLocaleString()}
              <span className="ml-1 text-sm font-normal text-slate-400">in use</span>
            </p>
          ) : (
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {slot?.used.toLocaleString() ?? 0}
              <span className="text-base font-semibold text-slate-400">
                {" "}/ {slot?.limit != null ? slot.limit.toLocaleString() : "—"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
