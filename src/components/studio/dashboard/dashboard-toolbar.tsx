"use client";

import { RefreshCw } from "lucide-react";
import { EMBED_MIN_REFRESH_SECONDS, REFRESH_INTERVAL_OPTIONS } from "@/lib/studio/refresh-presets";
import {
  TIME_RANGE_PRESETS,
  type DashboardTimeRange,
  datetimeLocalToIso,
  isoToDatetimeLocal,
} from "@/lib/studio/time-range";

type Props = {
  timeRange: DashboardTimeRange;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  refreshIntervalSeconds: number | null;
  onRefreshIntervalChange: (seconds: number | null) => void;
  onManualRefresh: () => void;
  lastRefreshedAt: Date | null;
  loading?: boolean;
  embedMode?: boolean;
  disabled?: boolean;
};

export function DashboardToolbar({
  timeRange,
  onTimeRangeChange,
  refreshIntervalSeconds,
  onRefreshIntervalChange,
  onManualRefresh,
  lastRefreshedAt,
  loading,
  embedMode,
  disabled,
}: Props) {
  const refreshOptions = embedMode
    ? REFRESH_INTERVAL_OPTIONS.filter((o) => o.seconds == null || o.seconds >= EMBED_MIN_REFRESH_SECONDS)
    : REFRESH_INTERVAL_OPTIONS;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Time range</label>
        <select
          value={timeRange.preset}
          disabled={disabled}
          onChange={(e) =>
            onTimeRangeChange({
              ...timeRange,
              preset: e.target.value as DashboardTimeRange["preset"],
            })
          }
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800"
        >
          {TIME_RANGE_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {timeRange.preset === "custom" && (
        <>
          <div className="flex w-full flex-col gap-1 sm:w-auto">
            <label className="text-xs font-medium text-slate-500">From</label>
            <input
              type="datetime-local"
              disabled={disabled}
              value={isoToDatetimeLocal(timeRange.from)}
              onChange={(e) =>
                onTimeRangeChange({
                  ...timeRange,
                  from: datetimeLocalToIso(e.target.value),
                })
              }
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
            />
          </div>
          <div className="flex w-full flex-col gap-1 sm:w-auto">
            <label className="text-xs font-medium text-slate-500">To</label>
            <input
              type="datetime-local"
              disabled={disabled}
              value={isoToDatetimeLocal(timeRange.to)}
              onChange={(e) =>
                onTimeRangeChange({
                  ...timeRange,
                  to: datetimeLocalToIso(e.target.value),
                })
              }
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
            />
          </div>
        </>
      )}

      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Refresh</label>
        <select
          value={refreshIntervalSeconds ?? ""}
          disabled={disabled}
          onChange={(e) => {
            const v = e.target.value;
            onRefreshIntervalChange(v === "" ? null : Number(v));
          }}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800"
        >
          {refreshOptions.map((o) => (
            <option key={o.label} value={o.seconds ?? ""}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 pb-0.5">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={onManualRefresh}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          title="Refresh now"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
        {lastRefreshedAt && (
          <span className="text-xs text-slate-500">
            Updated {lastRefreshedAt.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
