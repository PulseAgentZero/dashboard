"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GaugeComponent from "react-gauge-component";
import { getChartData, getYKeys, toHistogramBins, toWaterfallData } from "@/lib/studio/chart-data";
import {
  getDisplay,
  legendProps,
  xAxisProps,
  yAxisProps,
} from "@/lib/studio/chart-recharts-helpers";
import { resolvePieColors, resolveSeriesColor } from "@/lib/studio/chart-theme";
import { formatCellValue, formatRawCellValue } from "@/lib/studio/format-cell";
import { ResultsTable } from "@/components/studio/core/results-table";
import type { ChartType, ColumnFormatRule, QueryResult, VisualizationConfig } from "@/types/studio";

type Props = {
  chartType: ChartType;
  config: VisualizationConfig;
  result: QueryResult | null;
  columnFormats?: Record<string, ColumnFormatRule>;
  title?: string;
  height?: number;
};

function tooltipFormatter(columnFormats: Record<string, ColumnFormatRule>) {
  return (value: unknown, name: unknown) => {
    const label = String(name ?? "");
    const fmt = columnFormats[label];
    const formatted = formatCellValue(value, fmt);
    return [formatted, label] as [string, string];
  };
}

function dataKeyForRow(chartData: Record<string, unknown>[], key: string) {
  return key in (chartData[0] ?? {}) ? key : "value";
}

export function ChartRenderer({
  chartType,
  config,
  result,
  columnFormats = {},
  title,
  height = 280,
}: Props) {
  if (!result?.rows?.length) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
        No data
      </div>
    );
  }

  const displayTitle = title ?? config.title;
  const data = getChartData(result.rows, config, chartType);
  const yKeys = getYKeys(config);
  const tipFmt = tooltipFormatter(columnFormats);
  const displayOpts = getDisplay(config);
  const leg = legendProps(config);
  const primaryColor = resolveSeriesColor(config, yKeys[0] ?? "value", 0);

  if (chartType === "table") {
    return <ResultsTable result={result} columnFormats={columnFormats} />;
  }

  if (chartType === "number" || chartType === "stat") {
    const d = data as { value: number; label: string };
    const fmt = columnFormats[yKeys[0] ?? ""];
    const sparkKey = config.sparkline_column ?? config.x_axis;
    const sparkData =
      chartType === "stat" && sparkKey
        ? result.rows.map((r, i) => ({
            name: String(i),
            value: Number(r[sparkKey]) || 0,
          }))
        : null;
    return (
      <div className="flex flex-col items-center justify-center py-4" style={{ minHeight: height }}>
        {displayTitle && <p className="mb-2 text-sm text-slate-500">{displayTitle}</p>}
        <p className="text-4xl font-bold text-slate-900">
          {formatCellValue(d.value, fmt)}
          {config.unit ? <span className="ml-1 text-lg font-normal text-slate-500">{config.unit}</span> : null}
        </p>
        {sparkData && sparkData.length > 1 && (
          <div className="mt-4 w-full max-w-xs">
            <ResponsiveContainer width="100%" height={48}>
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey="value" stroke={primaryColor} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  if (chartType === "gauge") {
    const d = data as { value: number };
    const min = config.min_value ?? 0;
    const max = config.max_value ?? 100;
    const span = max - min || 1;
    const pct = Math.min(100, Math.max(0, ((d.value - min) / span) * 100));
    return (
      <div style={{ height }} className="px-4">
        {displayTitle && <p className="mb-2 text-center text-sm text-slate-500">{displayTitle}</p>}
        <GaugeComponent value={pct} />
        <p className="mt-2 text-center text-sm text-slate-600">
          {formatCellValue(d.value, columnFormats[yKeys[0] ?? ""])}
          {config.unit ? ` ${config.unit}` : ""}
        </p>
      </div>
    );
  }

  if (chartType === "heatmap") {
    const xKey = config.x_axis ?? result.columns[0];
    const yKeyRaw = config.y_axis;
    const yKey = Array.isArray(yKeyRaw) ? yKeyRaw[0] : yKeyRaw ?? result.columns[1];
    const valKey = config.value_column ?? result.columns[2] ?? result.columns[1];
    const xLabels = [...new Set(result.rows.map((r) => String(r[xKey ?? ""])))];
    const yLabels = [...new Set(result.rows.map((r) => String(r[yKey ?? ""])))];
    const max = Math.max(...result.rows.map((r) => Number(r[valKey ?? ""]) || 0), 1);
    return (
      <div className="overflow-auto p-2" style={{ maxHeight: height }}>
        {displayTitle && <p className="mb-2 text-sm font-medium text-slate-700">{displayTitle}</p>}
        <table className="text-xs">
          <thead>
            <tr>
              <th />
              {xLabels.map((x) => (
                <th key={x} className="px-1 py-0.5 font-normal text-slate-500">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yLabels.map((y) => (
              <tr key={y}>
                <td className="pr-2 font-medium text-slate-600">{y}</td>
                {xLabels.map((x) => {
                  const cell = result.rows.find(
                    (r) => String(r[xKey ?? ""]) === x && String(r[yKey ?? ""]) === y,
                  );
                  const v = Number(cell?.[valKey ?? ""]) || 0;
                  const intensity = v / max;
                  return (
                    <td
                      key={x}
                      className="px-1 py-0.5 text-center"
                      style={{
                        backgroundColor: `rgba(99, 102, 241, ${0.15 + intensity * 0.85})`,
                      }}
                    >
                      {formatCellValue(v, columnFormats[valKey ?? ""])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (chartType === "histogram") {
    const col = config.value_column ?? yKeys[0] ?? result.columns[0];
    const bins = toHistogramBins(result.rows, col);
    return wrapChart(displayTitle, height, config, (
      <BarChart data={bins}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis {...xAxisProps(config, "name")} />
        <YAxis {...yAxisProps(config)} />
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        <Bar dataKey="value" fill={primaryColor} />
      </BarChart>
    ));
  }

  const chartData = Array.isArray(data) ? data : [];

  if (chartType === "waterfall") {
    const valueKey = dataKeyForRow(chartData, yKeys[0] ?? "value");
    const wfData = toWaterfallData(chartData, valueKey);
    return wrapChart(displayTitle, height, config, (
      <BarChart data={wfData}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis {...xAxisProps(config, "name")} />
        <YAxis {...yAxisProps(config)} />
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        <Bar dataKey="base" stackId="wf" fill="transparent" />
        <Bar dataKey="value" stackId="wf" fill={primaryColor} />
      </BarChart>
    ));
  }

  if (chartType === "bar_gauge") {
    const valueKey = config.value_column ?? "value";
    return wrapChart(displayTitle, height, config, (
      <BarChart data={chartData} layout="vertical" margin={{ left: 96 }}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={96}
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickFormatter={xAxisProps(config).tickFormatter}
        />
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        <Bar dataKey={valueKey} fill={primaryColor} />
      </BarChart>
    ));
  }

  if (chartType === "bar") {
    const stackId = displayOpts.stacked ? "stack" : undefined;
    return wrapChart(displayTitle, height, config, (
      <BarChart data={chartData} layout={displayOpts.horizontal ? "vertical" : "horizontal"}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        {displayOpts.horizontal ? (
          <>
            <XAxis type="number" {...yAxisProps(config)} />
            <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 10 }} tickFormatter={xAxisProps(config).tickFormatter} />
          </>
        ) : (
          <>
            <XAxis {...xAxisProps(config, "name")} />
            <YAxis {...yAxisProps(config)} />
          </>
        )}
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        {yKeys.map((k, i) => (
          <Bar
            key={k}
            dataKey={dataKeyForRow(chartData, k)}
            fill={resolveSeriesColor(config, k, i)}
            stackId={stackId}
          />
        ))}
      </BarChart>
    ));
  }

  if (chartType === "line" || chartType === "trend") {
    return wrapChart(displayTitle, height, config, (
      <LineChart data={chartData}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis {...xAxisProps(config, "name")} />
        <YAxis {...yAxisProps(config)} />
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        {yKeys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={dataKeyForRow(chartData, k)}
            stroke={resolveSeriesColor(config, k, i)}
            dot={chartType === "trend" ? false : undefined}
            strokeWidth={chartType === "trend" ? 2 : 1.5}
          />
        ))}
      </LineChart>
    ));
  }

  if (chartType === "area") {
    const stackId = displayOpts.stacked ? "stack" : undefined;
    return wrapChart(displayTitle, height, config, (
      <AreaChart data={chartData}>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis {...xAxisProps(config, "name")} />
        <YAxis {...yAxisProps(config)} />
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        {yKeys.map((k, i) => {
          const c = resolveSeriesColor(config, k, i);
          return (
            <Area
              key={k}
              type="monotone"
              dataKey={dataKeyForRow(chartData, k)}
              fill={c}
              stroke={c}
              fillOpacity={0.35}
              stackId={stackId}
            />
          );
        })}
      </AreaChart>
    ));
  }

  if (chartType === "pie") {
    const labelKey = config.label_column ?? config.x_axis ?? "name";
    const valueKey = config.value_column ?? "value";
    const pieRows = chartData as Record<string, unknown>[];
    const pieColors = resolvePieColors(
      config,
      pieRows.map((row) => formatRawCellValue(row[labelKey] ?? "")),
    );
    return wrapChart(displayTitle, height, config, (
      <PieChart>
        <Pie data={pieRows} dataKey={valueKey} nameKey={labelKey} cx="50%" cy="50%" outerRadius={90}>
          {pieRows.map((row, i) => (
            <Cell key={i} fill={pieColors[i]} />
          ))}
          <LabelList dataKey={labelKey} position="outside" fontSize={10} />
        </Pie>
        <Tooltip formatter={tipFmt} />
        {leg && <Legend {...leg} />}
      </PieChart>
    ));
  }

  if (chartType === "scatter") {
    const xKey = config.x_axis ?? result.columns[0] ?? "x";
    const yKeyRaw = config.y_axis;
    const yKey = Array.isArray(yKeyRaw) ? yKeyRaw[0] : yKeyRaw ?? result.columns[1] ?? "y";
    const scatterData = result.rows.map((r) => ({
      x: Number(r[xKey]) || 0,
      y: Number(r[yKey]) || 0,
    }));
    return wrapChart(displayTitle, height, config, (
      <ScatterChart>
        {displayOpts.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis type="number" dataKey="x" name={xKey} />
        <YAxis type="number" dataKey="y" name={yKey} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={tipFmt} />
        {leg && <Legend {...leg} />}
        <Scatter data={scatterData} fill={primaryColor} />
      </ScatterChart>
    ));
  }

  if (chartType === "funnel") {
    return wrapChart(displayTitle, height, config, (
      <FunnelChart>
        <Tooltip formatter={tipFmt} />
        <Funnel dataKey="value" data={chartData} isAnimationActive>
          <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
        </Funnel>
      </FunnelChart>
    ));
  }

  return (
    <div className="text-sm text-slate-500" style={{ height }}>
      Unsupported chart type: {chartType}
    </div>
  );
}

function wrapChart(
  displayTitle: string | null | undefined,
  height: number,
  config: VisualizationConfig,
  child: React.ReactElement,
) {
  const titleInChart = Boolean(config.title);
  return (
    <div className="h-full w-full">
      {displayTitle && !titleInChart && (
        <p className="mb-2 text-sm font-medium text-slate-700">{displayTitle}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {child}
      </ResponsiveContainer>
    </div>
  );
}
