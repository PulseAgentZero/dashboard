"use client";

import { CHART_PALETTES } from "@/lib/studio/chart-theme";
import type { ChartStyleFormState } from "@/lib/studio/chart-field-schema";
import type { LegendPosition } from "@/types/studio";

type Props = {
  style: ChartStyleFormState;
  onChange: (next: ChartStyleFormState) => void;
  seriesKeys: string[];
  showCartesianOptions?: boolean;
};

export function VizStylePanel({
  style,
  onChange,
  seriesKeys,
  showCartesianOptions = true,
}: Props) {
  function patch(partial: Partial<ChartStyleFormState>) {
    onChange({ ...style, ...partial });
  }

  function applyPalette(colors: string[]) {
    onChange({ ...style, colors: [...colors] });
  }

  function setSeriesColor(key: string, color: string) {
    onChange({
      ...style,
      seriesColors: { ...style.seriesColors, [key]: color },
    });
  }

  function clearSeriesColor(key: string) {
    const next = { ...style.seriesColors };
    delete next[key];
    onChange({ ...style, seriesColors: next });
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Palette</p>
        <div className="space-y-2">
          {CHART_PALETTES.map((pal) => (
            <button
              key={pal.id}
              type="button"
              onClick={() => applyPalette(pal.colors)}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <span className="w-20 shrink-0 font-medium text-slate-700">{pal.label}</span>
              <span className="flex flex-1 gap-1">
                {pal.colors.slice(0, 8).map((c, i) => (
                  <span
                    key={i}
                    className="h-4 flex-1 rounded-sm border border-white/50 shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            </button>
          ))}
        </div>
      </section>

      {seriesKeys.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Series colors
          </p>
          <div className="space-y-2">
            {seriesKeys.map((key, i) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-slate-600" title={key}>
                  {key}
                </span>
                <input
                  type="color"
                  value={style.seriesColors[key] ?? style.colors[i % style.colors.length] ?? "#6366f1"}
                  onChange={(e) => setSeriesColor(key, e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                />
                {style.seriesColors[key] && (
                  <button
                    type="button"
                    onClick={() => clearSeriesColor(key)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Reset
                  </button>
                )}
              </label>
            ))}
          </div>
        </section>
      )}

      {showCartesianOptions && (
        <>
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Legend & grid
            </p>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">Show legend</span>
                <input
                  type="checkbox"
                  checked={style.showLegend}
                  onChange={(e) => patch({ showLegend: e.target.checked })}
                  className="rounded border-slate-300"
                />
              </label>
              {style.showLegend && (
                <label className="block text-sm">
                  <span className="text-slate-700">Legend position</span>
                  <select
                    value={style.legendPosition}
                    onChange={(e) => patch({ legendPosition: e.target.value as LegendPosition })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </label>
              )}
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">Show grid</span>
                <input
                  type="checkbox"
                  checked={style.showGrid}
                  onChange={(e) => patch({ showGrid: e.target.checked })}
                  className="rounded border-slate-300"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">Stacked</span>
                <input
                  type="checkbox"
                  checked={style.stacked}
                  onChange={(e) => patch({ stacked: e.target.checked })}
                  className="rounded border-slate-300"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">Horizontal bars</span>
                <input
                  type="checkbox"
                  checked={style.horizontal}
                  onChange={(e) => patch({ horizontal: e.target.checked })}
                  className="rounded border-slate-300"
                />
              </label>
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Axes</p>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="text-slate-700">X axis label</span>
                <input
                  value={style.xAxisLabel}
                  onChange={(e) => patch({ xAxisLabel: e.target.value })}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-700">Y axis label</span>
                <input
                  value={style.yAxisLabel}
                  onChange={(e) => patch({ yAxisLabel: e.target.value })}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-700">X label rotation ({style.xLabelRotate}°)</span>
                <input
                  type="range"
                  min={-90}
                  max={90}
                  step={5}
                  value={style.xLabelRotate}
                  onChange={(e) => patch({ xLabelRotate: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-700">Max label length</span>
                <input
                  type="number"
                  min={8}
                  max={80}
                  value={style.xLabelMaxChars}
                  onChange={(e) => patch({ xLabelMaxChars: Number(e.target.value) || 24 })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-700">Max data points</span>
                <input
                  type="number"
                  min={5}
                  max={500}
                  value={style.maxPoints}
                  onChange={(e) => patch({ maxPoints: Number(e.target.value) || 50 })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
                <p className="mt-1 text-xs text-slate-400">Limits rows shown on the chart.</p>
              </label>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
