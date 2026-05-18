"use client";

import type { ChartType } from "@/types/studio";

const CHART_TYPES: { type: ChartType; label: string }[] = [
  { type: "bar", label: "Bar" },
  { type: "line", label: "Line" },
  { type: "area", label: "Area" },
  { type: "pie", label: "Pie" },
  { type: "scatter", label: "Scatter" },
  { type: "table", label: "Table" },
  { type: "number", label: "Number" },
  { type: "funnel", label: "Funnel" },
  { type: "heatmap", label: "Heatmap" },
  { type: "gauge", label: "Gauge" },
  { type: "waterfall", label: "Waterfall" },
  { type: "trend", label: "Trend" },
];

type Props = {
  value: ChartType;
  onChange: (type: ChartType) => void;
  disabled?: boolean;
};

export function ChartTypePicker({ value, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {CHART_TYPES.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          disabled={disabled}
          onClick={() => onChange(type)}
          className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
            value === type
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
