"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { ChartTypePicker } from "@/components/studio/ui/chart-type-picker";
import type { ChartType, QueryResult, StudioVisualization, VisualizationConfig } from "@/types/studio";

type Props = {
  open: boolean;
  queryId: string;
  result: QueryResult | null;
  columns: string[];
  existing?: StudioVisualization | null;
  onClose: () => void;
  onSave: (body: {
    name: string;
    chart_type: ChartType;
    config: VisualizationConfig;
  }) => Promise<void>;
  onRecommend?: () => Promise<{ chart_type: ChartType; config: VisualizationConfig; reasoning: string }>;
};

export function VizEditorPanel({
  open,
  result,
  columns,
  existing,
  onClose,
  onSave,
  onRecommend,
}: Props) {
  const [name, setName] = useState("");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [labelCol, setLabelCol] = useState("");
  const [title, setTitle] = useState("");
  const [pending, setPending] = useState(false);
  const [reasoning, setReasoning] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(existing?.name ?? "Chart");
    setChartType(existing?.chart_type ?? "bar");
    const c = existing?.config ?? {};
    setXAxis(c.x_axis ?? columns[0] ?? "");
    setYAxis(typeof c.y_axis === "string" ? c.y_axis : columns[1] ?? "");
    setValueCol(c.value_column ?? columns[1] ?? "");
    setLabelCol(c.label_column ?? columns[0] ?? "");
    setTitle(c.title ?? "");
    setReasoning("");
  }, [open, existing, columns]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const config: VisualizationConfig = { title: title || null };
      if (chartType === "pie") {
        config.label_column = labelCol;
        config.value_column = valueCol;
      } else if (chartType === "number" || chartType === "gauge") {
        config.value_column = valueCol;
      } else if (chartType === "scatter") {
        config.x_axis = xAxis;
        config.y_axis = yAxis;
      } else {
        config.x_axis = xAxis;
        config.y_axis = yAxis;
      }
      await onSave({ name, chart_type: chartType, config });
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
      const c = r.config;
      if (c.x_axis) setXAxis(c.x_axis);
      if (typeof c.y_axis === "string") setYAxis(c.y_axis);
      if (c.value_column) setValueCol(c.value_column);
      if (c.label_column) setLabelCol(c.label_column);
      if (c.title) setTitle(c.title);
      setReasoning(r.reasoning);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">{existing ? "Edit chart" : "New chart"}</h2>
        <button type="button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <form onSubmit={submit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {!result?.rows?.length && (
          <p className="text-sm text-amber-600">Run the query first to configure axes.</p>
        )}
        <label className="block text-sm">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            required
          />
        </label>
        <ChartTypePicker value={chartType} onChange={setChartType} />
        {onRecommend && (
          <button
            type="button"
            onClick={() => void handleRecommend()}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-sm font-medium text-indigo-700"
          >
            <Sparkles size={14} />
            AI recommend
          </button>
        )}
        {reasoning && <p className="text-xs text-slate-500">{reasoning}</p>}
        <label className="block text-sm">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        {(chartType === "bar" || chartType === "line" || chartType === "area" || chartType === "trend") && (
          <>
            <label className="block text-sm">
              X axis
              <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Y axis
              <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </>
        )}
        {(chartType === "pie" || chartType === "number" || chartType === "gauge") && (
          <>
            {chartType === "pie" && (
              <label className="block text-sm">
                Label column
                <select value={labelCol} onChange={(e) => setLabelCol(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                  {columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="block text-sm">
              Value column
              <select value={valueCol} onChange={(e) => setValueCol(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </>
        )}
        {chartType === "scatter" && (
          <>
            <label className="block text-sm">
              X
              <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Y
              <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          Save chart
        </button>
      </form>
    </div>
  );
}
