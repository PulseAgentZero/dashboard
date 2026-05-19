import type { VisualizationConfig } from "@/types/studio";

function limitRows(rows: Record<string, unknown>[], config: VisualizationConfig) {
  const max = config.display?.max_points ?? 50;
  if (rows.length <= max) return rows;
  return rows.slice(0, max);
}

export function getChartData(
  rows: Record<string, unknown>[],
  config: VisualizationConfig,
  chartType: string,
) {
  rows = limitRows(rows, config);
  const xKey = config.x_axis ?? config.label_column;
  const yKeys = getYKeys(config);

  if (chartType === "number" || chartType === "gauge" || chartType === "stat") {
    const yKey = yKeys[0] ?? Object.keys(rows[0] ?? {})[1] ?? Object.keys(rows[0] ?? {})[0];
    const val = rows[0]?.[yKey ?? ""];
    return { value: Number(val) || 0, label: String(yKey ?? "value") };
  }

  if (chartType === "pie" || chartType === "funnel" || chartType === "bar_gauge") {
    const labelKey = config.label_column ?? config.x_axis ?? rows[0] ? Object.keys(rows[0])[0] : "name";
    const valueKey = config.value_column ?? "value";
    return rows.map((r, i) => ({
      name: String(r[labelKey ?? ""] ?? i),
      value: Number(r[valueKey ?? ""]) || 0,
      ...r,
    }));
  }

  if (!xKey && rows.length) {
    const keys = Object.keys(rows[0] ?? {});
    return rows.map((r, i) => {
      const row: Record<string, unknown> = {
        name: String(r[keys[0]] ?? i),
        value: Number(r[keys[1] ?? keys[0]]) || 0,
        ...r,
      };
      for (const k of yKeys) {
        row[k] = Number(r[k]) || 0;
      }
      return row;
    });
  }

  return rows.map((r) => {
    const row: Record<string, unknown> = {
      name: String(r[xKey ?? "name"] ?? ""),
      value: Number(r[yKeys[0] ?? "value"]) || 0,
      ...r,
    };
    for (const k of yKeys) {
      if (k in r) row[k] = Number(r[k]) || 0;
    }
    return row;
  });
}

export function getYKeys(config: VisualizationConfig): string[] {
  if (Array.isArray(config.y_axis)) return config.y_axis.filter(Boolean);
  if (config.y_axis) return [config.y_axis];
  if (config.value_column) return [config.value_column];
  return ["value"];
}

/** Cumulative waterfall: each bar shows delta; running total encoded for display. */
export function toWaterfallData(
  chartData: Record<string, unknown>[],
  valueKey: string,
): { name: string; value: number; total: number; base: number }[] {
  let running = 0;
  return chartData.map((row) => {
    const delta = Number(row[valueKey] ?? row.value) || 0;
    const start = running;
    running += delta;
    return {
      name: String(row.name ?? ""),
      value: delta,
      total: running,
      base: start,
    };
  });
}

/** Simple histogram bins for a numeric column. */
export function toHistogramBins(
  rows: Record<string, unknown>[],
  column: string,
  binCount = 10,
): { name: string; value: number }[] {
  const values = rows.map((r) => Number(r[column])).filter((v) => !Number.isNaN(v));
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = span / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    name: i === binCount - 1 ? `${(min + i * step).toFixed(1)}+` : `${(min + i * step).toFixed(1)}–${(min + (i + 1) * step).toFixed(1)}`,
    value: 0,
  }));
  for (const v of values) {
    let idx = Math.floor((v - min) / step);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].value += 1;
  }
  return bins;
}
