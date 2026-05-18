import type { VisualizationConfig } from "@/types/studio";

export function getChartData(
  rows: Record<string, unknown>[],
  config: VisualizationConfig,
  chartType: string,
) {
  const xKey = config.x_axis ?? config.label_column;
  const yKey = Array.isArray(config.y_axis) ? config.y_axis[0] : config.y_axis ?? config.value_column;

  if (chartType === "number" || chartType === "gauge") {
    const val = rows[0]?.[yKey ?? ""] ?? rows[0]?.[Object.keys(rows[0] ?? {})[0] ?? ""];
    return { value: Number(val) || 0, label: String(yKey ?? "value") };
  }

  if (!xKey && rows.length) {
    const keys = Object.keys(rows[0] ?? {});
    return rows.map((r, i) => ({
      name: String(r[keys[0]] ?? i),
      value: Number(r[keys[1] ?? keys[0]]) || 0,
      ...r,
    }));
  }

  return rows.map((r) => ({
    name: String(r[xKey ?? "name"] ?? ""),
    value: Number(r[yKey ?? "value"]) || 0,
    ...r,
  }));
}

export function getYKeys(config: VisualizationConfig): string[] {
  if (Array.isArray(config.y_axis)) return config.y_axis;
  if (config.y_axis) return [config.y_axis];
  if (config.value_column) return [config.value_column];
  return ["value"];
}
