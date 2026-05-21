export type TimeRangePreset =
  | "last_15m"
  | "last_1h"
  | "last_6h"
  | "last_24h"
  | "last_7d"
  | "last_30d"
  | "custom";

export type DashboardTimeRange = {
  preset: TimeRangePreset;
  from?: string | null;
  to?: string | null;
};

export const TIME_RANGE_PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: "last_15m", label: "Last 15 minutes" },
  { value: "last_1h", label: "Last 1 hour" },
  { value: "last_6h", label: "Last 6 hours" },
  { value: "last_24h", label: "Last 24 hours" },
  { value: "last_7d", label: "Last 7 days" },
  { value: "last_30d", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

export const DEFAULT_TIME_RANGE: DashboardTimeRange = { preset: "last_24h" };

export function normalizeTimeRange(raw: unknown): DashboardTimeRange {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_TIME_RANGE };
  const o = raw as Record<string, unknown>;
  const preset = (o.preset as TimeRangePreset) || "last_24h";
  return {
    preset: TIME_RANGE_PRESETS.some((p) => p.value === preset) ? preset : "last_24h",
    from: (o.from as string | null | undefined) ?? null,
    to: (o.to as string | null | undefined) ?? null,
  };
}

/** Format for datetime-local inputs from ISO string. */
export function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function datetimeLocalToIso(local: string): string | null {
  if (!local.trim()) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
