"use client";

import { Loader2 } from "lucide-react";
import type { StudioQueryRun } from "@/types/studio";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  running: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
};

type Props = {
  run: StudioQueryRun | null;
  isPolling?: boolean;
};

export function RunStatusPoller({ run, isPolling }: Props) {
  if (!run) return null;

  const style = STATUS_STYLES[run.status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {(isPolling || run.status === "running" || run.status === "pending") && (
        <Loader2 size={12} className="animate-spin" />
      )}
      <span className="capitalize">{run.status}</span>
      {run.row_count != null && run.status === "completed" && (
        <span className="font-normal opacity-80">· {run.row_count.toLocaleString()} rows</span>
      )}
      {run.error && run.status === "failed" && (
        <span className="max-w-md truncate font-normal" title={run.error}>
          · {run.error}
        </span>
      )}
    </div>
  );
}
