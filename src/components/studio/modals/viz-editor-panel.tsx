"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { ChartRenderer } from "@/components/studio/charts/chart-renderer";
import { VizStylePanel } from "@/components/studio/charts/viz-style-panel";
import { ChartTypePicker } from "@/components/studio/ui/chart-type-picker";
import {
  buildConfigFromForm,
  defaultChartStyleForm,
  defaultConfigForChart,
  getChartFields,
  parseConfigToForm,
  parseStyleFromConfig,
  type ChartFieldDef,
  type ChartStyleFormState,
} from "@/lib/studio/chart-field-schema";
import { getYKeys } from "@/lib/studio/chart-data";
import type {
  ChartType,
  ColumnFormatRule,
  QueryResult,
  StudioVisualization,
  VisualizationConfig,
} from "@/types/studio";

type EditorTab = "data" | "style" | "format";

type Props = {
  open: boolean;
  queryId: string;
  result: QueryResult | null;
  columns: string[];
  existing?: StudioVisualization | null;
  columnFormats?: Record<string, ColumnFormatRule>;
  onClose: () => void;
  onSave: (body: {
    name: string;
    chart_type: ChartType;
    config: VisualizationConfig;
    column_formats?: Record<string, ColumnFormatRule>;
  }) => Promise<void>;
  onRecommend?: () => Promise<{ chart_type: ChartType; config: VisualizationConfig; reasoning: string }>;
};

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

const CARTESIAN_TYPES: ChartType[] = ["bar", "line", "area", "trend", "scatter", "waterfall"];

export function VizEditorPanel({
  open,
  result,
  columns,
  existing,
  columnFormats: initialFormats = {},
  onClose,
  onSave,
  onRecommend,
}: Props) {
  const [name, setName] = useState("");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [tab, setTab] = useState<EditorTab>("data");
  const [title, setTitle] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxes, setYAxes] = useState<string[]>([]);
  const [valueCol, setValueCol] = useState("");
  const [labelCol, setLabelCol] = useState("");
  const [sparklineCol, setSparklineCol] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [unit, setUnit] = useState("");
  const [style, setStyle] = useState<ChartStyleFormState>(defaultChartStyleForm);
  const [columnFormats, setColumnFormats] = useState<Record<string, ColumnFormatRule>>({});
  const [pending, setPending] = useState(false);
  const [reasoning, setReasoning] = useState("");

  const rows = result?.rows ?? [];

  useEffect(() => {
    if (!open) return;
    setName(existing?.name ?? "Chart");
    const ct = existing?.chart_type ?? "bar";
    setChartType(ct);
    setTab("data");
    const cfg = existing?.config ?? defaultConfigForChart(ct, columns, rows);
    setTitle(cfg.title ?? "");
    setColumnFormats(existing?.column_formats ?? initialFormats);
    const parsed = parseConfigToForm(cfg);
    setXAxis(parsed.xAxis);
    setYAxes(parsed.yAxes);
    setValueCol(parsed.valueCol);
    setLabelCol(parsed.labelCol);
    setSparklineCol(parsed.sparklineCol);
    setMinValue(parsed.minValue);
    setMaxValue(parsed.maxValue);
    setUnit(parsed.unit);
    setStyle(parseStyleFromConfig(cfg));
    setReasoning("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when panel opens
  }, [open, existing?.id]);

  useEffect(() => {
    if (!open || existing) return;
    const defaults = defaultConfigForChart(chartType, columns, rows);
    const parsed = parseConfigToForm(defaults);
    setXAxis(parsed.xAxis);
    setYAxes(parsed.yAxes);
    setValueCol(parsed.valueCol);
    setLabelCol(parsed.labelCol);
    setSparklineCol(parsed.sparklineCol);
    if (chartType === "gauge") {
      setMinValue(parsed.minValue || "0");
      setMaxValue(parsed.maxValue || "100");
    }
  }, [chartType, open, existing, columns, rows]);

  const draftConfig = useMemo(
    () =>
      buildConfigFromForm(
        chartType,
        {
          xAxis,
          yAxes,
          valueCol,
          labelCol,
          sparklineCol,
          minValue,
          maxValue,
          unit,
          title,
        },
        style,
      ),
    [
      chartType,
      xAxis,
      yAxes,
      valueCol,
      labelCol,
      sparklineCol,
      minValue,
      maxValue,
      unit,
      title,
      style,
    ],
  );

  const debouncedConfig = useDebounced(draftConfig, 150);
  const fields = getChartFields(chartType);
  const rowCount = result?.rows?.length ?? 0;
  const maxPoints = style.maxPoints;
  const truncated = rowCount > maxPoints;

  const seriesKeys = useMemo(() => {
    if (chartType === "pie" || chartType === "funnel" || chartType === "bar_gauge") {
      const labelKey = labelCol || xAxis;
      if (!labelKey || !rows.length) return [];
      const seen = new Set<string>();
      for (const r of rows.slice(0, maxPoints)) {
        seen.add(String(r[labelKey] ?? ""));
      }
      return [...seen].filter(Boolean);
    }
    return getYKeys(draftConfig);
  }, [chartType, labelCol, xAxis, rows, draftConfig, maxPoints]);

  const showCartesianStyle =
    CARTESIAN_TYPES.includes(chartType) || chartType === "pie" || chartType === "heatmap";

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onSave({
        name,
        chart_type: chartType,
        config: draftConfig,
        column_formats: columnFormats,
      });
      onClose();
    } finally {
      setPending(false);
    }
  }

  async function handleRecommend() {
    if (!onRecommend) return;
    setPending(true);
    try {
      const r = await onRecommend();
      setChartType(r.chart_type);
      const parsed = parseConfigToForm(r.config);
      setXAxis(parsed.xAxis);
      setYAxes(parsed.yAxes);
      setValueCol(parsed.valueCol);
      setLabelCol(parsed.labelCol);
      setSparklineCol(parsed.sparklineCol);
      setMinValue(parsed.minValue);
      setMaxValue(parsed.maxValue);
      setUnit(parsed.unit);
      if (r.config.title) setTitle(r.config.title);
      setStyle(parseStyleFromConfig(r.config));
      setReasoning(r.reasoning);
    } finally {
      setPending(false);
    }
  }

  function toggleYAxis(col: string) {
    setYAxes((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  }

  const formatColumns = [...new Set([xAxis, ...yAxes, valueCol, labelCol, sparklineCol].filter(Boolean))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div
        className="mx-4 flex h-[min(92dvh,880px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="viz-editor-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 id="viz-editor-title" className="text-sm font-semibold text-slate-900">
            {existing ? "Edit chart" : "New chart"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 flex-1 flex-col border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
              {truncated && (
                <p className="text-xs text-amber-600">
                  Showing first {maxPoints} of {rowCount} rows
                </p>
              )}
            </div>
            <div className="h-72 min-h-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 p-4 lg:h-[400px]">
              <ChartRenderer
                chartType={chartType}
                config={debouncedConfig}
                result={result}
                columnFormats={columnFormats}
              />
            </div>
          </div>

          <form
            onSubmit={submit}
            className="flex w-full shrink-0 flex-col lg:w-[380px]"
          >
            <div className="flex border-b border-slate-200 bg-slate-50/40">
              {(
                [
                  ["data", "Data"],
                  ["style", "Style"],
                  ["format", "Format"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`relative flex-1 py-3 text-xs font-medium transition duration-150 ease-in-out ${
                    tab === id
                      ? "text-orange-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                  {tab === id && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {!result?.rows?.length && (
                <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  Run the query first to configure axes and preview the chart.
                </p>
              )}

              {tab === "data" && (
                <div className="space-y-4">
                  <label className="block text-xs">
                    <span className="font-medium text-slate-700">Name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </label>
                  
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Chart type</p>
                    <ChartTypePicker value={chartType} onChange={setChartType} />
                  </div>
                  
                  {onRecommend && (
                    <button
                      type="button"
                      onClick={() => void handleRecommend()}
                      disabled={pending}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/40 py-2 text-xs font-medium text-orange-700 transition duration-150 hover:bg-orange-50 disabled:opacity-50"
                    >
                      <Sparkles size={13} className="text-orange-500" />
                      AI recommend
                    </button>
                  )}
                  
                  {reasoning && <p className="text-xs leading-relaxed text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-2.5">{reasoning}</p>}
                  
                  <label className="block text-xs">
                    <span className="font-medium text-slate-700">Title</span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Optional chart title"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </label>
                  
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    {fields.map((field) => (
                      <FieldControl
                        key={field.key}
                        field={field}
                        columns={columns}
                        xAxis={xAxis}
                        setXAxis={setXAxis}
                        yAxes={yAxes}
                        setYAxes={setYAxes}
                        toggleYAxis={toggleYAxis}
                        valueCol={valueCol}
                        setValueCol={setValueCol}
                        labelCol={labelCol}
                        setLabelCol={setLabelCol}
                        sparklineCol={sparklineCol}
                        setSparklineCol={setSparklineCol}
                        minValue={minValue}
                        setMinValue={setMinValue}
                        maxValue={maxValue}
                        setMaxValue={setMaxValue}
                        unit={unit}
                        setUnit={setUnit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tab === "style" && (
                <VizStylePanel
                  style={style}
                  onChange={setStyle}
                  seriesKeys={seriesKeys}
                  showCartesianOptions={showCartesianStyle}
                />
              )}

              {tab === "format" && (
                <>
                  {formatColumns.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">Select data columns first to format values.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Column formats</p>
                      <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-3 space-y-2.5">
                        {formatColumns.map((col) => (
                          <label key={col} className="flex items-center gap-3 text-xs">
                            <span className="w-24 truncate text-slate-600 font-medium" title={col}>
                              {col}
                            </span>
                            <select
                              value={columnFormats[col]?.type ?? ""}
                              onChange={(e) => {
                                const type = e.target.value as ColumnFormatRule["type"] | "";
                                setColumnFormats((prev) => {
                                  const next = { ...prev };
                                  if (!type) delete next[col];
                                  else next[col] = { type };
                                  return next;
                                });
                              }}
                              className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
                              <option value="">Default</option>
                              <option value="number">Number</option>
                              <option value="currency">Currency</option>
                              <option value="percent">Percent</option>
                              <option value="date">Date</option>
                              <option value="badge">Badge</option>
                            </select>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-slate-50/40 p-4">
              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending && <Loader2 size={14} className="animate-spin" />}
                {existing ? "Update chart" : "Save chart"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FieldControl({
  field,
  columns,
  xAxis,
  setXAxis,
  yAxes,
  setYAxes,
  toggleYAxis,
  valueCol,
  setValueCol,
  labelCol,
  setLabelCol,
  sparklineCol,
  setSparklineCol,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  unit,
  setUnit,
}: {
  field: ChartFieldDef;
  columns: string[];
  xAxis: string;
  setXAxis: (v: string) => void;
  yAxes: string[];
  setYAxes: (cols: string[]) => void;
  toggleYAxis: (col: string) => void;
  valueCol: string;
  setValueCol: (v: string) => void;
  labelCol: string;
  setLabelCol: (v: string) => void;
  sparklineCol: string;
  setSparklineCol: (v: string) => void;
  minValue: string;
  setMinValue: (v: string) => void;
  maxValue: string;
  setMaxValue: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
}) {
  if (field.kind === "number") {
    const val = field.key === "min_value" ? minValue : maxValue;
    const set = field.key === "min_value" ? setMinValue : setMaxValue;
    return (
      <label className="block text-xs">
        <span className="font-medium text-slate-600">{field.label}</span>
        <input
          type="number"
          value={val}
          onChange={(e) => set(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </label>
    );
  }
  if (field.kind === "text") {
    return (
      <label className="block text-xs">
        <span className="font-medium text-slate-600">{field.label}</span>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </label>
    );
  }
  if (field.kind === "columns") {
    return (
      <div className="text-xs">
        <p className="font-medium text-slate-600">{field.label}</p>
        <div className="mt-1 max-h-36 space-y-1.5 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2.5 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
          {columns.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-700">
              <input 
                type="checkbox" 
                checked={yAxes.includes(c)} 
                onChange={() => toggleYAxis(c)} 
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="truncate text-xs font-medium text-slate-800">{c}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  const value =
    field.key === "x_axis"
      ? xAxis
      : field.key === "value_column"
        ? valueCol
        : field.key === "label_column"
          ? labelCol
          : field.key === "sparkline_column"
            ? sparklineCol
            : yAxes[0] ?? "";
  if (field.key === "y_axis" && field.kind === "column") {
    return (
      <label className="block text-xs">
        <span className="font-medium text-slate-600">{field.label}</span>
        <select
          value={yAxes[0] ?? ""}
          onChange={(e) => setYAxes(e.target.value ? [e.target.value] : [])}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          {columns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className="block text-xs">
      <span className="font-medium text-slate-600">{field.label}</span>
      <select
        value={value}
        onChange={(e) => {
          if (field.key === "x_axis") setXAxis(e.target.value);
          else if (field.key === "value_column") setValueCol(e.target.value);
          else if (field.key === "label_column") setLabelCol(e.target.value);
          else if (field.key === "sparkline_column") setSparklineCol(e.target.value);
        }}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {field.key === "sparkline_column" && <option value="">None</option>}
        {columns.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}