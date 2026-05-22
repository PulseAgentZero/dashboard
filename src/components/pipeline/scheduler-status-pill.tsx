"use client";

import { AlertTriangle, CheckCircle2, Loader2, RadioTower } from "lucide-react";
import { useSchedulerStatus } from "@/hooks/pipeline/use-pipeline";

function formatAge(seconds: number | null): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function SchedulerStatusPill() {
  const { data, isLoading, isError } = useSchedulerStatus();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xs">
        <Loader2 size={13} className="animate-spin text-slate-400" />
        <span className="text-slate-500">Checking scheduler…</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs shadow-xs">
        <AlertTriangle size={13} className="text-amber-600" />
        <span className="text-amber-800">Scheduler status unavailable</span>
      </div>
    );
  }

  const healthy = data.healthy;
  const accent = healthy
    ? {
        wrap: "border-emerald-200 bg-emerald-50/40",
        icon: "text-emerald-600",
        label: "text-emerald-900",
        sub: "text-emerald-700/80",
      }
    : {
        wrap: "border-rose-200 bg-rose-50/40",
        icon: "text-rose-600",
        label: "text-rose-900",
        sub: "text-rose-700/80",
      };

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs shadow-xs ${accent.wrap}`}
      title={
        data.process_id
          ? `pid=${data.process_id}${data.host ? ` on ${data.host}` : ""}`
          : undefined
      }
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white shadow-xs ${accent.icon}`}>
        {healthy ? <CheckCircle2 size={14} /> : <RadioTower size={14} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[11px] font-semibold ${accent.label}`}>
          {healthy ? "Scheduler healthy" : "Scheduler not seen recently"}
        </p>
        <p className={`text-[10.5px] ${accent.sub}`}>
          Last heartbeat {formatAge(data.age_seconds)}
          {data.scheduled_runs_total > 0 &&
            ` · ${data.scheduled_runs_total.toLocaleString()} scheduled runs`}
        </p>
      </div>
    </div>
  );
}
