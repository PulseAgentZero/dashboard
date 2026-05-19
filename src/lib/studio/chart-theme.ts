import type { VisualizationConfig } from "@/types/studio";

/** Default series palettes (Grafana-inspired). */
export const CHART_PALETTES: { id: string; label: string; colors: string[] }[] = [
  {
    id: "pulse",
    label: "Pulse",
    colors: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"],
  },
  {
    id: "classic",
    label: "Classic",
    colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#f97316", "#06b6d4", "#64748b"],
  },
  {
    id: "warm",
    label: "Warm",
    colors: ["#f97316", "#ef4444", "#f59e0b", "#ec4899", "#eab308", "#fb7185", "#fdba74", "#fca5a5"],
  },
  {
    id: "cool",
    label: "Cool",
    colors: ["#0ea5e9", "#6366f1", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#22d3ee", "#64748b"],
  },
  {
    id: "mono",
    label: "Monochrome",
    colors: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"],
  },
];

export const DEFAULT_PALETTE = CHART_PALETTES[0]!.colors;

export function resolveSeriesColor(
  config: VisualizationConfig,
  seriesKey: string,
  index: number,
): string {
  const override = config.series_colors?.[seriesKey];
  if (override) return override;
  const palette = config.colors?.length ? config.colors : DEFAULT_PALETTE;
  return palette[index % palette.length] ?? DEFAULT_PALETTE[0]!;
}

export function resolvePieColors(
  config: VisualizationConfig,
  labels: string[],
): string[] {
  const palette = config.colors?.length ? config.colors : DEFAULT_PALETTE;
  return labels.map((label, i) => config.series_colors?.[label] ?? palette[i % palette.length]!);
}

export function formatAxisTickLabel(raw: unknown, maxChars?: number): string {
  let s = String(raw ?? "");
  if (maxChars && s.length > maxChars) {
    return `${s.slice(0, Math.max(4, maxChars - 1))}…`;
  }
  return s;
}
