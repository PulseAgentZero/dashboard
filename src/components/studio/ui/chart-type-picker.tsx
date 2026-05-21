"use client";

import type { ChartType } from "@/types/studio";

const CHART_GROUPS: { label: string; types: { type: ChartType; label: string }[] }[] = [
  {
    label: "Trends",
    types: [
      { type: "bar", label: "Bar" },
      { type: "line", label: "Line" },
      { type: "area", label: "Area" },
      { type: "trend", label: "Trend" },
      { type: "scatter", label: "Scatter" },
      { type: "waterfall", label: "Waterfall" },
    ],
  },
  {
    label: "Parts",
    types: [
      { type: "pie", label: "Pie" },
      { type: "funnel", label: "Funnel" },
      { type: "histogram", label: "Histogram" },
      { type: "heatmap", label: "Heatmap" },
    ],
  },
  {
    label: "KPI",
    types: [
      { type: "number", label: "Number" },
      { type: "stat", label: "Stat" },
      { type: "gauge", label: "Gauge" },
      { type: "bar_gauge", label: "Bar gauge" },
    ],
  },
  {
    label: "Data",
    types: [{ type: "table", label: "Table" }],
  },
];

type Props = {
  value: ChartType;
  onChange: (type: ChartType) => void;
  disabled?: boolean;
};

export function ChartTypePicker({ value, onChange, disabled }: Props) {
  return (
    <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
      {CHART_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {group.types.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                disabled={disabled}
                onClick={() => onChange(type)}
                title={label}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                  value === type
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
