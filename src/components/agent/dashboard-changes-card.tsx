"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  BarChart3,
  Check,
  GitCommit,
  Loader2,
  Minus,
  Plus,
  RotateCw,
  Sliders,
  Type,
} from "lucide-react";
import type {
  DashboardChange,
  ProposeChangesArtifact,
} from "@/lib/api/agent-api";

function ChangeRow({ change }: { change: DashboardChange }) {
  const action = change.action;

  if (action === "rename") {
    const c = change as Extract<DashboardChange, { action: "rename" }>;
    return (
      <li className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <Type size={12} className="mt-0.5 text-amber-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-amber-700">
            Rename
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-slate-700">
            <span className="line-through text-slate-400 truncate">
              {c.old_name || "(current name)"}
            </span>
            <ArrowRight size={11} className="shrink-0 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate">
              {c.new_name}
            </span>
          </div>
        </div>
      </li>
    );
  }

  if (action === "set_description") {
    const c = change as Extract<DashboardChange, { action: "set_description" }>;
    return (
      <li className="space-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
          Update description
        </p>
        {c.old_description && (
          <p className="rounded bg-rose-50/50 px-2 py-1 text-[11px] text-rose-700 line-through decoration-rose-400">
            {c.old_description}
          </p>
        )}
        <p className="rounded bg-emerald-50/60 px-2 py-1 text-[11px] text-emerald-800">
          {c.new_description}
        </p>
      </li>
    );
  }

  if (action === "set_public") {
    const c = change as Extract<DashboardChange, { action: "set_public" }>;
    return (
      <li className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <RotateCw size={12} className="text-slate-400" />
        <span className="text-slate-700">
          Visibility →{" "}
          <span className="font-semibold text-slate-900">
            {c.is_public ? "Public" : "Private"}
          </span>
        </span>
      </li>
    );
  }

  if (action === "remove_chart") {
    const c = change as Extract<DashboardChange, { action: "remove_chart" }>;
    return (
      <li className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs">
        <Minus size={12} className="mt-0.5 text-rose-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-rose-700">
            Remove chart
          </p>
          <p className="mt-0.5 truncate text-slate-800 line-through decoration-rose-400">
            {c.chart_name || c.item_id}
          </p>
        </div>
      </li>
    );
  }

  if (action === "add_chart") {
    const c = change as Extract<DashboardChange, { action: "add_chart" }>;
    return (
      <li className="rounded-lg border border-emerald-200 bg-emerald-50/40 px-3 py-2 text-xs">
        <div className="flex items-start gap-2">
          <Plus size={12} className="mt-0.5 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-emerald-700">
              Add chart
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-slate-900">
              <BarChart3 size={11} className="text-emerald-700" />
              <span className="truncate font-semibold">
                {c.spec?.name || "Untitled chart"}
              </span>
              {c.spec?.chart_type && (
                <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  {c.spec.chart_type}
                </span>
              )}
            </p>
            {c.spec?.description && (
              <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-600">
                {c.spec.description}
              </p>
            )}
          </div>
        </div>
      </li>
    );
  }

  if (action === "replace_chart") {
    const c = change as Extract<DashboardChange, { action: "replace_chart" }>;
    return (
      <li className="rounded-lg border border-amber-200 bg-amber-50/40 px-3 py-2 text-xs">
        <div className="flex items-start gap-2">
          <RotateCw size={12} className="mt-0.5 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-amber-700">
              Replace chart
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-slate-700">
              <span className="truncate text-slate-500 line-through">
                {c.old_chart_name || c.item_id}
              </span>
              <ArrowRight size={11} className="shrink-0 text-slate-400" />
              <span className="truncate font-semibold text-slate-900">
                {c.spec?.name || "Untitled chart"}
              </span>
            </p>
          </div>
        </div>
      </li>
    );
  }

  if (action === "set_dashboard_params") {
    const c = change as Extract<
      DashboardChange,
      { action: "set_dashboard_params" }
    >;
    return (
      <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
          Update filters
        </p>
        <ul className="mt-1 flex flex-wrap gap-1">
          {c.params.map((p) => (
            <li key={p.name}>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] text-slate-800">
                <Sliders
                  size={9}
                  className="mr-1 inline-block align-[-1px] text-slate-500"
                />
                {`{{${p.name}}}`}
              </code>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  if (action === "set_time_range") {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <RotateCw size={12} className="text-slate-400" />
        <span className="text-slate-700">Update default time range</span>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
        {action}
      </p>
    </li>
  );
}

export function DashboardChangesCard({
  artifact,
  onApply,
  onReject,
  disabled = false,
}: {
  artifact: ProposeChangesArtifact;
  onApply: (message: string) => void;
  onReject: (message: string) => void;
  disabled?: boolean;
}) {
  const changes = artifact.changes ?? [];
  const rejected = artifact.rejected ?? [];

  const [submitted, setSubmitted] = useState<"apply" | "reject" | null>(null);

  function handleApply() {
    if (disabled || submitted) return;
    setSubmitted("apply");
    onApply("Apply these changes.");
  }

  function handleReject() {
    if (disabled || submitted) return;
    setSubmitted("reject");
    onReject("Don't apply these — let me describe again.");
  }

  if (changes.length === 0 && rejected.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-start gap-2.5 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
          <GitCommit size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            Proposed changes
          </p>
          <p className="mt-0.5 truncate text-[11.5px] text-slate-500">
            {artifact.dashboard_name
              ? `for ${artifact.dashboard_name}`
              : "for this dashboard"}
            {" · "}
            {changes.length} update{changes.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {changes.length > 0 && (
        <ul className="space-y-1.5 px-4 py-3">
          {changes.map((c, i) => (
            <ChangeRow key={i} change={c} />
          ))}
        </ul>
      )}

      {rejected.length > 0 && (
        <div className="border-t border-slate-100 bg-rose-50/30 px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-rose-700">
            <Ban size={11} />
            Skipped ({rejected.length})
          </p>
          <ul className="mt-1 space-y-1 text-[11px] text-rose-700">
            {rejected.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <AlertCircle size={10} className="mt-0.5 shrink-0" />
                <span>
                  {(r.reason || "rejected").replace(/_/g, " ")}
                  {(r.change as { action?: string })?.action && (
                    <span className="ml-1 text-rose-500">
                      — {(r.change as { action?: string }).action}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <p className="text-[11px] text-slate-500">
          {submitted === "apply"
            ? "Applying changes…"
            : submitted === "reject"
              ? "Sent — describe the change you want."
              : "Review and apply, or describe what to change instead."}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReject}
            disabled={disabled || submitted !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Ban size={11} />
            Skip
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={disabled || submitted !== null || changes.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitted === "apply" ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Check size={11} />
            )}
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
