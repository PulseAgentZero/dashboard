"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, Loader2, Play, RefreshCw, XCircle,
  Calendar, AlertTriangle,
} from "lucide-react";
import { usePipelineRuns, usePipelineSchedule, useTriggerPipeline, useUpdateSchedule } from "@/hooks/pipeline/use-pipeline";
import type { PipelineRun } from "@/lib/api/pipeline-api";

function statusIcon(status: PipelineRun["status"]) {
  if (status === "success") return <CheckCircle2 size={14} className="text-emerald-500" />;
  if (status === "failed") return <XCircle size={14} className="text-rose-500" />;
  if (status === "running") return <Loader2 size={14} className="animate-spin text-blue-500" />;
  return <Clock size={14} className="text-slate-400" />;
}

function statusBadge(status: PipelineRun["status"]) {
  const map = {
    success: "bg-emerald-50 text-emerald-700",
    failed: "bg-rose-50 text-rose-700",
    running: "bg-blue-50 text-blue-700",
    pending: "bg-slate-100 text-slate-600",
  };
  return `inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${map[status] ?? map.pending}`;
}

function duration(run: PipelineRun) {
  if (run.duration_seconds == null) return "—";
  const s = run.duration_seconds;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function ScheduleCard() {
  const { data: schedule, isLoading } = usePipelineSchedule();
  const { mutate: update, isPending } = useUpdateSchedule();
  const [editing, setEditing] = useState(false);
  const [cron, setCron] = useState("");

  function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    update(
      { enabled: true, cron: cron || null },
      { onSuccess: () => setEditing(false) },
    );
  }

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-xl bg-slate-100" />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-slate-400" />
          <p className="text-sm font-semibold text-slate-800">Schedule</p>
        </div>
        {!editing && (
          <button
            onClick={() => { setCron(schedule?.cron ?? ""); setEditing(true); }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Cron expression
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-blue-500"
              placeholder="0 2 * * *  (daily at 02:00)"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-slate-400">Leave blank to disable scheduling.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending && <Loader2 size={11} className="animate-spin" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-3 space-y-1.5">
          <p className="text-sm text-slate-700">
            {schedule?.enabled && schedule.cron
              ? <span className="font-mono">{schedule.cron}</span>
              : <span className="text-slate-400">No schedule configured</span>}
          </p>
          {schedule?.next_run_at && (
            <p className="text-[11px] text-slate-400">
              Next run: {new Date(schedule.next_run_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PipelinePage() {
  const { data: runsRaw, isLoading } = usePipelineRuns(30);
  const { mutate: trigger, isPending: triggering } = useTriggerPipeline();

  function toArray<T>(raw: unknown, ...keys: string[]): T[] {
    if (Array.isArray(raw)) return raw as T[];
    if (raw && typeof raw === "object") {
      for (const k of keys) {
        const v = (raw as Record<string, unknown>)[k];
        if (Array.isArray(v)) return v as T[];
      }
    }
    return [];
  }

  const runs = toArray<PipelineRun>(runsRaw, "runs", "data", "items");

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pipeline</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Trigger data processing runs and manage your schedule.
          </p>
        </div>
        <button
          onClick={() => trigger()}
          disabled={triggering}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {triggering ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {triggering ? "Triggering…" : "Run now"}
        </button>
      </div>

      <ScheduleCard />

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">Recent runs</p>
          {!isLoading && runs.length > 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
              {runs.length}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        )}

        {!isLoading && runs.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <RefreshCw size={28} className="text-slate-200" />
            <p className="mt-2 text-sm font-medium text-slate-500">No runs yet</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Click &quot;Run now&quot; to trigger your first pipeline run.
            </p>
          </div>
        )}

        {runs.length > 0 && (
          <div className="divide-y divide-slate-100">
            {runs.map((run) => (
              <div key={run.id} className="flex items-center gap-4 px-5 py-3">
                <div className="shrink-0">{statusIcon(run.status)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={statusBadge(run.status)}>{run.status}</span>
                    {run.entities_processed != null && (
                      <span className="text-[11px] text-slate-400">
                        {run.entities_processed.toLocaleString()} entities
                      </span>
                    )}
                  </div>
                  {run.error_message && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-600">
                      <AlertTriangle size={10} />
                      <span className="truncate">{run.error_message}</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-500">{duration(run)}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
