import type { VisualizationConfig } from "@/types/studio";
import { formatAxisTickLabel } from "@/lib/studio/chart-theme";

export function getDisplay(config: VisualizationConfig) {
  return {
    showLegend: config.display?.show_legend !== false,
    legendPosition: config.display?.legend_position ?? "bottom",
    showGrid: config.display?.show_grid !== false,
    stacked: config.display?.stacked === true,
    horizontal: config.display?.horizontal === true,
    xRotate: config.display?.x_label_rotate ?? undefined,
    xMaxChars: config.display?.x_label_max_chars ?? 24,
    maxPoints: config.display?.max_points ?? 50,
  };
}

export function tickFormatter(config: VisualizationConfig) {
  const max = getDisplay(config).xMaxChars;
  return (v: unknown) => formatAxisTickLabel(v, max);
}

export function legendProps(config: VisualizationConfig) {
  const { showLegend, legendPosition } = getDisplay(config);
  if (!showLegend) return null;
  return {
    verticalAlign: legendPosition === "top" ? "top" : "bottom",
    align: legendPosition === "left" || legendPosition === "right" ? legendPosition : "center",
    layout: legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal",
  } as const;
}

export function xAxisProps(config: VisualizationConfig, dataKey = "name") {
  const d = getDisplay(config);
  const rotate = d.xRotate ?? (d.xMaxChars < 20 ? -35 : 0);
  return {
    dataKey,
    tick: { fontSize: 11, fill: "#64748b" },
    angle: rotate,
    textAnchor: rotate < 0 ? ("end" as const) : ("middle" as const),
    height: rotate < -20 ? 72 : 48,
    interval: 0,
    tickFormatter: tickFormatter(config),
    label: config.axes?.x_label
      ? {
          value: config.axes.x_label,
          position: "insideBottom" as const,
          offset: -4,
          fontSize: 11,
        }
      : undefined,
  };
}

export function yAxisProps(config: VisualizationConfig) {
  return {
    tick: { fontSize: 11, fill: "#64748b" },
    label: config.axes?.y_label
      ? {
          value: config.axes.y_label,
          angle: -90,
          position: "insideLeft" as const,
          fontSize: 11,
        }
      : undefined,
  };
}
