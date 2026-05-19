import type { ChartType, QueryResult, VisualizationConfig } from "@/types/studio";

export type ChartFieldKey =
  | "x_axis"
  | "y_axis"
  | "value_column"
  | "label_column"
  | "sparkline_column"
  | "min_value"
  | "max_value"
  | "unit";

export type ChartFieldDef = {
  key: ChartFieldKey;
  label: string;
  kind: "column" | "columns" | "number" | "text";
  required?: boolean;
};

const FIELD_SCHEMA: Record<ChartType, ChartFieldDef[]> = {
  bar: [
    { key: "x_axis", label: "X axis", kind: "column", required: true },
    { key: "y_axis", label: "Y axis", kind: "columns", required: true },
  ],
  line: [
    { key: "x_axis", label: "X axis", kind: "column", required: true },
    { key: "y_axis", label: "Y axis", kind: "columns", required: true },
  ],
  area: [
    { key: "x_axis", label: "X axis", kind: "column", required: true },
    { key: "y_axis", label: "Y axis", kind: "columns", required: true },
  ],
  trend: [
    { key: "x_axis", label: "X axis", kind: "column", required: true },
    { key: "y_axis", label: "Y axis", kind: "columns", required: true },
  ],
  waterfall: [
    { key: "x_axis", label: "Category", kind: "column", required: true },
    { key: "y_axis", label: "Value", kind: "column", required: true },
  ],
  pie: [
    { key: "label_column", label: "Label", kind: "column", required: true },
    { key: "value_column", label: "Value", kind: "column", required: true },
  ],
  funnel: [
    { key: "label_column", label: "Stage", kind: "column", required: true },
    { key: "value_column", label: "Value", kind: "column", required: true },
  ],
  scatter: [
    { key: "x_axis", label: "X", kind: "column", required: true },
    { key: "y_axis", label: "Y", kind: "column", required: true },
  ],
  number: [{ key: "value_column", label: "Value", kind: "column", required: true }],
  stat: [
    { key: "value_column", label: "Value", kind: "column", required: true },
    { key: "sparkline_column", label: "Sparkline (optional)", kind: "column" },
  ],
  gauge: [
    { key: "value_column", label: "Value", kind: "column", required: true },
    { key: "min_value", label: "Min", kind: "number" },
    { key: "max_value", label: "Max", kind: "number" },
    { key: "unit", label: "Unit", kind: "text" },
  ],
  heatmap: [
    { key: "x_axis", label: "X", kind: "column", required: true },
    { key: "y_axis", label: "Y", kind: "column", required: true },
    { key: "value_column", label: "Value", kind: "column", required: true },
  ],
  histogram: [{ key: "value_column", label: "Numeric column", kind: "column", required: true }],
  bar_gauge: [
    { key: "label_column", label: "Category", kind: "column", required: true },
    { key: "value_column", label: "Value", kind: "column", required: true },
  ],
  table: [],
};

export function getChartFields(chartType: ChartType): ChartFieldDef[] {
  return FIELD_SCHEMA[chartType] ?? [];
}

function isNumericSample(val: unknown): boolean {
  if (val == null || val === "") return false;
  return !Number.isNaN(Number(val));
}

function categoricalScore(col: string): number {
  const l = col.toLowerCase();
  if (l === "id" || l.endsWith("_id") || l.includes("uuid") || l === "pk") return -20;
  if (l.includes("name") || l.includes("title") || l.includes("label")) return 20;
  if (l.includes("date") || l.includes("time") || l.includes("month")) return 5;
  return 0;
}

export function inferColumnRoles(
  columns: string[],
  rows: Record<string, unknown>[],
): { categorical: string[]; numeric: string[] } {
  const categorical: string[] = [];
  const numeric: string[] = [];
  for (const col of columns) {
    const samples = rows.slice(0, 20).map((r) => r[col]);
    const numericCount = samples.filter(isNumericSample).length;
    if (samples.length > 0 && numericCount / samples.length >= 0.7) {
      numeric.push(col);
    } else {
      categorical.push(col);
    }
  }
  categorical.sort((a, b) => categoricalScore(b) - categoricalScore(a));
  return { categorical, numeric };
}

export function defaultConfigForChart(
  chartType: ChartType,
  columns: string[],
  rows: Record<string, unknown>[] = [],
): VisualizationConfig {
  const { categorical, numeric } = inferColumnRoles(columns, rows);
  const cat = categorical[0] ?? columns[0] ?? "";
  const num = numeric[0] ?? columns[1] ?? columns[0] ?? "";
  const num2 = numeric[1] ?? num;

  switch (chartType) {
    case "pie":
    case "funnel":
    case "bar_gauge":
      return { label_column: cat, value_column: num };
    case "number":
    case "histogram":
      return { value_column: num };
    case "stat":
      return { value_column: num, sparkline_column: cat || null };
    case "gauge":
      return { value_column: num, min_value: 0, max_value: 100, unit: null };
    case "heatmap":
      return { x_axis: cat, y_axis: categorical[1] ?? columns[1] ?? cat, value_column: num };
    case "scatter":
      return { x_axis: num, y_axis: numeric[1] ?? num2 };
    case "waterfall":
      return { x_axis: cat, y_axis: num };
    case "table":
      return {};
    default:
      return { x_axis: cat, y_axis: numeric.length > 1 ? [num, num2] : num };
  }
}

export type ChartStyleFormState = {
  colors: string[];
  seriesColors: Record<string, string>;
  showLegend: boolean;
  legendPosition: "top" | "bottom" | "left" | "right";
  showGrid: boolean;
  stacked: boolean;
  horizontal: boolean;
  xLabelRotate: number;
  xLabelMaxChars: number;
  maxPoints: number;
  xAxisLabel: string;
  yAxisLabel: string;
};

export const defaultChartStyleForm = (): ChartStyleFormState => ({
  colors: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  seriesColors: {},
  showLegend: true,
  legendPosition: "bottom",
  showGrid: true,
  stacked: false,
  horizontal: false,
  xLabelRotate: -35,
  xLabelMaxChars: 24,
  maxPoints: 50,
  xAxisLabel: "",
  yAxisLabel: "",
});

export function parseStyleFromConfig(config: VisualizationConfig): ChartStyleFormState {
  const base = defaultChartStyleForm();
  return {
    colors: config.colors?.length ? [...config.colors] : base.colors,
    seriesColors: { ...(config.series_colors ?? {}) },
    showLegend: config.display?.show_legend !== false,
    legendPosition: config.display?.legend_position ?? "bottom",
    showGrid: config.display?.show_grid !== false,
    stacked: config.display?.stacked === true,
    horizontal: config.display?.horizontal === true,
    xLabelRotate: config.display?.x_label_rotate ?? -35,
    xLabelMaxChars: config.display?.x_label_max_chars ?? 24,
    maxPoints: config.display?.max_points ?? 50,
    xAxisLabel: config.axes?.x_label ?? "",
    yAxisLabel: config.axes?.y_label ?? "",
  };
}

export function buildConfigFromForm(
  chartType: ChartType,
  form: {
    xAxis: string;
    yAxes: string[];
    valueCol: string;
    labelCol: string;
    sparklineCol: string;
    minValue: string;
    maxValue: string;
    unit: string;
    title: string;
  },
  style?: ChartStyleFormState,
): VisualizationConfig {
  const config: VisualizationConfig = { title: form.title || null };
  if (style) {
    config.colors = style.colors;
    config.series_colors = Object.keys(style.seriesColors).length ? style.seriesColors : null;
    config.display = {
      show_legend: style.showLegend,
      legend_position: style.legendPosition,
      show_grid: style.showGrid,
      stacked: style.stacked,
      horizontal: style.horizontal,
      x_label_rotate: style.xLabelRotate,
      x_label_max_chars: style.xLabelMaxChars,
      max_points: style.maxPoints,
    };
    config.axes = {
      x_label: style.xAxisLabel || null,
      y_label: style.yAxisLabel || null,
    };
  }
  const fields = getChartFields(chartType);

  for (const f of fields) {
    switch (f.key) {
      case "x_axis":
        config.x_axis = form.xAxis || null;
        break;
      case "y_axis":
        if (f.kind === "columns") {
          config.y_axis =
            form.yAxes.length > 1 ? form.yAxes : form.yAxes[0] ? form.yAxes[0] : null;
        } else {
          config.y_axis = form.yAxes[0] || null;
        }
        break;
      case "value_column":
        config.value_column = form.valueCol || null;
        break;
      case "label_column":
        config.label_column = form.labelCol || null;
        break;
      case "sparkline_column":
        config.sparkline_column = form.sparklineCol || null;
        break;
      case "min_value":
        config.min_value = form.minValue !== "" ? Number(form.minValue) : null;
        break;
      case "max_value":
        config.max_value = form.maxValue !== "" ? Number(form.maxValue) : null;
        break;
      case "unit":
        config.unit = form.unit || null;
        break;
    }
  }
  return config;
}

export function parseConfigToForm(config: VisualizationConfig): {
  xAxis: string;
  yAxes: string[];
  valueCol: string;
  labelCol: string;
  sparklineCol: string;
  minValue: string;
  maxValue: string;
  unit: string;
} {
  const y = config.y_axis;
  return {
    xAxis: config.x_axis ?? "",
    yAxes: Array.isArray(y) ? y : y ? [y] : [],
    valueCol: config.value_column ?? "",
    labelCol: config.label_column ?? "",
    sparklineCol: config.sparkline_column ?? "",
    minValue: config.min_value != null ? String(config.min_value) : "",
    maxValue: config.max_value != null ? String(config.max_value) : "",
    unit: config.unit ?? "",
  };
}

export function sampleResultForPreview(result: QueryResult | null): boolean {
  return Boolean(result?.rows?.length);
}
