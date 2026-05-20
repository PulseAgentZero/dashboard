"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
  Zap,
} from "lucide-react";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";
import { PipelineScheduleCard } from "@/components/pipeline/pipeline-schedule-card";
import { DashboardDocsLink } from "@/components/dashboard/docs-link";
import {
  usePipelineRuns,
  usePipelineSchedule,
  useTriggerPipeline,
} from "@/hooks/pipeline/use-pipeline";
import { useSchemaMappings } from "@/hooks/schema-mappings/use-schema-mappings";
import type { PipelineRun, PipelineRunStatus } from "@/lib/api/pipeline-api";
import { getScheduleDisplayLabel, presetFromCron } from "@/lib/pipeline-schedule-presets";

function statusLabel(status: PipelineRunStatus) {
  if (status === "success") return "Succeeded";
  if (status === "failed") return "Failed";
  if (status === "running") return "Running";
  return "Queued";
}

function StatusIcon({ status }: { status: PipelineRunStatus }) {
  if (status === "success")
    return <CheckCircle2 size={16} className="text-emerald-500" />;
  if (status === "failed") return <XCircle size={16} className="text-rose-500" />;
  if (status === "running")
    return <Loader2 size={16} className="animate-spin text-orange-500" />;
  return <Clock size={16} className="text-slate-400" />;
}

function statusPillClass(status: PipelineRunStatus) {
  const map = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
    failed: "bg-rose-50 text-rose-700 ring-rose-200/60",
    running: "bg-orange-50 text-orange-700 ring-orange-200/60",
    pending: "bg-slate-100 text-slate-600 ring-slate-200/60",
  };
  return `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${map[status]}`;
}

function formatDuration(run: PipelineRun) {
  if (run.duration_seconds == null) {
    if (run.status === "running" || run.status === "pending") return "In progress";
    return "—";
  }
  const s = run.duration_seconds;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function triggerLabel(source: string | null) {
  if (!source) return "Manual";
  if (source === "initial_mapping") return "First mapping";
  if (source === "scheduled") return "Scheduled";
  if (source === "manual" || source === "manual_sync") return "Manual";
  return source.replace(/_/g, " ");
}

function SummaryPill({
  label,
  value,
  sub,
  accent = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "success" | "warning" | "danger";
}) {
  const accentCls = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-rose-200 bg-rose-50/50",
  }[accent];
  const valueCls = {
    default: "text-slate-900",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
  }[accent];

  return (
    <div
      className={`min-w-0 flex-1 rounded-xl border px-4 py-3 shadow-xs ${accentCls}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${valueCls}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{sub}</p>}
    </div>
  );
}

function RunRow({ run }: { run: PipelineRun }) {
  return (
    <div className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-slate-50/80 sm:px-5 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 group-hover:bg-white sm:mt-0">
          <StatusIcon status={run.status} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={statusPillClass(run.status)}>{statusLabel(run.status)}</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600">
              {triggerLabel(run.trigger_source)}
            </span>
            {run.entities_processed != null && (
              <span className="text-[11px] text-slate-500">
                {run.entities_processed.toLocaleString()} entities scored
              </span>
            )}
          </div>
          {run.current_step && (run.status === "running" || run.status === "pending") && (
            <p className="mt-1 truncate text-xs text-orange-600 font-medium">
              Step: {run.current_step.replace(/_/g, " ")}
            </p>
          )}
          {run.error_message && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-600">
              <AlertTriangle size={12} className="shrink-0" />
              <span className="line-clamp-2">{run.error_message}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100/60 pt-2 sm:border-t-0 sm:pt-0 sm:block sm:text-right">
        <p className="text-xs sm:text-sm font-medium text-slate-700">{formatDuration(run)}</p>
        <p className="text-[11px] text-slate-400">{formatWhen(run.created_at)}</p>
      </div>
    </div>
  );
}

export function PipelinePage() {
  const { data: runs = [], isLoading } = usePipelineRuns(30);
  const { data: schedule } = usePipelineSchedule();
  const { data: mappings } = useSchemaMappings();
  const { mutate: trigger, isPending: triggering } = useTriggerPipeline();

  const hasMapping = (mappings?.length ?? 0) > 0;
  const activeRun = runs.find((r) => r.status === "running" || r.status === "pending");
  const lastRun = runs[0];
  const successCount = runs.filter((r) => r.status === "success").length;
  const failedCount = runs.filter((r) => r.status === "failed").length;

  const scheduleLabel = useMemo(() => {
    if (!schedule) return "Not configured";
    const id = presetFromCron(schedule.cron, schedule.enabled);
    return getScheduleDisplayLabel(id, schedule.cron);
  }, [schedule]);

  const lastStatusAccent = useMemo(() => {
    if (!lastRun) return "default" as const;
    if (lastRun.status === "success") return "success" as const;
    if (lastRun.status === "failed") return "danger" as const;
    if (lastRun.status === "running") return "warning" as const;
    return "default" as const;
  }, [lastRun]);

  return (
    <DashboardPageShell width="wide" className="space-y-6 py-2">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-600 text-white shadow-xs">
              <GitBranch size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Pipeline</h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Score entities, generate recommendations, and refresh your models
              </p>
            </div>
          </div>
          <div className="mt-3">
            <DashboardDocsLink
              href="/docs/architecture"
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              How the pipeline works
            </DashboardDocsLink>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PipelineScheduleCard />
          <button
            type="button"
            onClick={() => trigger()}
            disabled={triggering || !hasMapping}
            title={!hasMapping ? "Complete a data mapping first" : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {triggering ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Play size={15} />
            )}
            {triggering ? "Starting…" : "Run now"}
          </button>
        </div>
      </header>

    {!hasMapping && (
  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-600 mt-0.5 sm:mt-0">
        <AlertTriangle size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Schema mapping required</p>
        <p className="mt-0.5 max-w-xl text-xs text-slate-500 leading-relaxed">
          The pipeline requires an active data mapping on your SQL connection before it can run. 
          Saving your first mapping will trigger an initial sync automatically.
        </p>
      </div>
    </div>
    <Link
      href="/dashboard/connections"
      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors"
    >
      Configure mapping
      <ArrowRight size={13} />
    </Link>
  </div>
)}

      {activeRun && (
        <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3">
          <Loader2 size={18} className="animate-spin text-orange-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-orange-900">Pipeline in progress</p>
            <p className="truncate text-xs text-orange-700/90">
              {activeRun.current_step
                ? `Current step: ${activeRun.current_step.replace(/_/g, " ")}`
                : "Your run is queued or executing — this page refreshes automatically."}
            </p>
          </div>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryPill
          label="Last run"
          value={lastRun ? statusLabel(lastRun.status) : "None"}
          sub={lastRun ? formatWhen(lastRun.completed_at ?? lastRun.created_at) : "No runs yet"}
          accent={lastStatusAccent}
        />
        <SummaryPill
          label="Total runs"
          value={runs.length}
          sub={isLoading ? "Loading…" : "Shown: last 30"}
        />
        <SummaryPill
          label="Succeeded"
          value={successCount}
          accent={successCount > 0 ? "success" : "default"}
        />
        <SummaryPill
          label="Failed"
          value={failedCount}
          accent={failedCount > 0 ? "danger" : "default"}
        />
        <SummaryPill 
          label="Schedule" 
          value={scheduleLabel} 
          sub={schedule?.enabled ? "Automatic" : "Manual only"} 
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900">What runs here</h2>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Pull entities from your mapped tables
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Score risk and churn signals per entity
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Generate AI recommendations for your team
            </li>
          </ul>
          <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500">
            After you save your first data mapping, Entivia queues the first pipeline automatically.
            Use <strong className="font-medium text-slate-700">Run now</strong> anytime you need
            fresh scores before the next scheduled run.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Run history</p>
              <p className="text-xs text-slate-500">Most recent executions for your organization</p>
            </div>
            {!isLoading && runs.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {runs.length}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          {!isLoading && runs.length === 0 && (
            <div className="flex flex-col items-center px-4 py-12 sm:py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
                <RefreshCw size={26} className="text-slate-300" />
              </div>
              <p className="mt-4 text-base font-semibold text-slate-700">No pipeline runs yet</p>
              <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
                {hasMapping
                  ? 'Click "Run now" to process your mapped data, or wait for the schedule.'
                  : "Complete a data mapping on a connection — your first run starts automatically."}
              </p>
            </div>
          )}

          {runs.length > 0 && (
            <div className="divide-y divide-slate-100">
              {runs.map((run) => (
                <RunRow key={run.id} run={run} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
}