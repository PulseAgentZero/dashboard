"use client";

import { useState } from "react";
import {
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  FileText,
  Loader2,
  Pencil,
  Sliders,
} from "lucide-react";
import type {
  DraftPlanArtifact,
  PlanChartSpec,
  PlanParameterSpec,
} from "@/lib/api/agent-api";

function ChartRow({ chart, idx }: { chart: PlanChartSpec; idx: number }) {
  const [open, setOpen] = useState(false);
  const name = chart.name || `Chart ${idx + 1}`;
  const sqlPreview = (chart.sql || "").trim();
  return (
    <li className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2 text-left"
      >
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-600">
          <BarChart3 size={12} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-xs font-semibold text-slate-900">
              {name}
            </span>
            {chart.chart_type && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                {chart.chart_type}
              </span>
            )}
          </span>
          {chart.description && (
            <span className="mt-0.5 line-clamp-2 block text-[11px] text-slate-500">
              {chart.description}
            </span>
          )}
        </span>
        {open ? (
          <ChevronDown size={13} className="mt-1 text-slate-400" />
        ) : (
          <ChevronRight size={13} className="mt-1 text-slate-400" />
        )}
      </button>
      {open && sqlPreview && (
        <pre className="overflow-x-auto border-t border-slate-100 bg-slate-900/95 px-3 py-2 text-[10.5px] leading-snug text-slate-100">
          <code>{sqlPreview}</code>
        </pre>
      )}
    </li>
  );
}

function ParameterRow({ param }: { param: PlanParameterSpec }) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
      <Sliders size={11} className="mt-0.5 text-slate-400" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-1.5">
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[10.5px] text-slate-800">
            {`{{${param.name}}}`}
          </code>
          {param.type && (
            <span className="text-[10.5px] text-slate-500">{param.type}</span>
          )}
          {param.default !== undefined && param.default !== null && (
            <span className="text-[10.5px] text-slate-500">
              · default: <code className="text-slate-700">{String(param.default)}</code>
            </span>
          )}
        </span>
        {param.description && (
          <span className="mt-0.5 block text-[11px] text-slate-500">
            {param.description}
          </span>
        )}
      </span>
    </li>
  );
}

export function DashboardPlanCard({
  artifact,
  onConfirm,
  onEdit,
  disabled = false,
}: {
  artifact: DraftPlanArtifact;
  onConfirm: (message: string) => void;
  onEdit: (message: string) => void;
  disabled?: boolean;
}) {
  const plan = artifact.plan ?? {};
  const charts = plan.charts ?? [];
  const params = plan.dashboard_params ?? [];

  const [submitted, setSubmitted] = useState<"confirm" | "edit" | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  function handleConfirm() {
    if (disabled || submitted) return;
    setSubmitted("confirm");
    onConfirm("Looks good — please build this dashboard.");
  }

  function handleEditSubmit() {
    if (disabled || submitted) return;
    const text = editText.trim();
    if (!text) return;
    setSubmitted("edit");
    onEdit(`Change the plan: ${text}`);
  }

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-start gap-2.5 border-b border-slate-100 bg-gradient-to-br from-orange-50/70 to-white px-4 py-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-600 text-white">
          <FileText size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {plan.name || "New dashboard"}
          </p>
          {plan.description && (
            <p className="mt-0.5 line-clamp-2 text-[11.5px] text-slate-600">
              {plan.description}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-500">
            {plan.connection_name && (
              <span className="inline-flex items-center gap-1">
                <Database size={10} />
                {plan.connection_name}
              </span>
            )}
            {charts.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <BarChart3 size={10} />
                {charts.length} chart{charts.length === 1 ? "" : "s"}
              </span>
            )}
            {params.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Sliders size={10} />
                {params.length} parameter{params.length === 1 ? "" : "s"}
              </span>
            )}
            {plan.time_range && Object.keys(plan.time_range).length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock size={10} />
                time range set
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-3">
        {charts.length > 0 && (
          <section>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
              Charts
            </p>
            <ul className="space-y-1.5">
              {charts.map((c, i) => (
                <ChartRow key={c.id || c.name || i} chart={c} idx={i} />
              ))}
            </ul>
          </section>
        )}

        {params.length > 0 && (
          <section>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
              Filters
            </p>
            <ul className="space-y-1.5">
              {params.map((p) => (
                <ParameterRow key={p.name} param={p} />
              ))}
            </ul>
          </section>
        )}

        {plan.notes && (
          <p className="rounded-lg bg-slate-50 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
            {plan.notes}
          </p>
        )}
      </div>

      {editing ? (
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">
          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            What should I change?
          </label>
          <textarea
            rows={2}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="e.g. Add a chart for top 10 customers by revenue; make the time window 30 days."
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={disabled || submitted !== null}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              disabled={disabled || submitted !== null || !editText.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitted === "edit" ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Pencil size={11} />
              )}
              Send changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
          <p className="text-[11px] text-slate-500">
            {submitted === "confirm"
              ? "Building your dashboard…"
              : "Confirm to build, or describe what to tweak."}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={disabled || submitted !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={11} />
              Edit
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={disabled || submitted !== null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitted === "confirm" ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              Confirm & build
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
