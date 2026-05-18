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
import { getChartData, getYKeys } from "@/lib/studio/chart-data";
import { formatCellValue } from "@/lib/studio/format-cell";
import { ResultsTable } from "@/components/studio/core/results-table";
import type { ChartType, ColumnFormatRule, QueryResult, VisualizationConfig } from "@/types/studio";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

type Props = {
  chartType: ChartType;
  config: VisualizationConfig;
  result: QueryResult | null;
  columnFormats?: Record<string, ColumnFormatRule>;
  title?: string;
  height?: number;
};

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
      <div
        className="flex items-center justify-center text-sm text-slate-400"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  const displayTitle = title ?? config.title;
  const data = getChartData(result.rows, config, chartType);
  const yKeys = getYKeys(config);

  if (chartType === "table") {
    return <ResultsTable result={result} columnFormats={columnFormats} />;
  }

  if (chartType === "number") {
    const d = data as { value: number; label: string };
    const fmt = columnFormats[yKeys[0] ?? ""];
    return (
      <div className="flex flex-col items-center justify-center py-8" style={{ minHeight: height }}>
        {displayTitle && <p className="mb-2 text-sm text-slate-500">{displayTitle}</p>}
        <p className="text-4xl font-bold text-slate-900">
          {formatCellValue(d.value, fmt)}
        </p>
      </div>
    );
  }

  if (chartType === "gauge") {
    const d = data as { value: number };
    const pct = Math.min(100, Math.max(0, d.value));
    return (
      <div style={{ height }} className="px-4">
        {displayTitle && <p className="mb-2 text-center text-sm text-slate-500">{displayTitle}</p>}
        <GaugeComponent value={pct} />
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
    const max = Math.max(
      ...result.rows.map((r) => Number(r[valKey ?? ""]) || 0),
      1,
    );
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
                      {v}
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

  const chartData = Array.isArray(data) ? data : [];

  const wrap = (child: React.ReactElement) => (
    <div>
      {displayTitle && <p className="mb-2 text-sm font-medium text-slate-700">{displayTitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {child}
      </ResponsiveContainer>
    </div>
  );

  if (chartType === "bar" || chartType === "waterfall") {
    return wrap(
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        {yKeys.map((k, i) => (
          <Bar key={k} dataKey={k in chartData[0] ? k : "value"} fill={COLORS[i % COLORS.length]} />
        ))}
      </BarChart>,
    );
  }

  if (chartType === "line" || chartType === "trend") {
    return wrap(
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        {yKeys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k in (chartData[0] ?? {}) ? k : "value"}
            stroke={COLORS[i % COLORS.length]}
            dot={chartType === "trend" ? false : undefined}
            strokeWidth={chartType === "trend" ? 2 : 1.5}
          />
        ))}
      </LineChart>,
    );
  }

  if (chartType === "area") {
    return wrap(
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {yKeys.map((k, i) => (
          <Area
            key={k}
            type="monotone"
            dataKey={k in (chartData[0] ?? {}) ? k : "value"}
            fill={COLORS[i % COLORS.length]}
            stroke={COLORS[i % COLORS.length]}
            fillOpacity={0.3}
          />
        ))}
      </AreaChart>,
    );
  }

  if (chartType === "pie") {
    const labelKey = config.label_column ?? config.x_axis ?? "name";
    const valueKey = config.value_column ?? "value";
    return wrap(
      <PieChart>
        <Pie data={chartData} dataKey={valueKey} nameKey={labelKey} cx="50%" cy="50%" outerRadius={90}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList dataKey={labelKey} position="outside" fontSize={10} />
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>,
    );
  }

  if (chartType === "scatter") {
    const xKey = config.x_axis ?? result.columns[0] ?? "x";
    const yKeyRaw = config.y_axis;
    const yKey = Array.isArray(yKeyRaw) ? yKeyRaw[0] : yKeyRaw ?? result.columns[1] ?? "y";
    const scatterData = result.rows.map((r) => ({
      x: Number(r[xKey]) || 0,
      y: Number(r[yKey]) || 0,
    }));
    return wrap(
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name={xKey} />
        <YAxis type="number" dataKey="y" name={yKey} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={scatterData} fill="#6366f1" />
      </ScatterChart>,
    );
  }

  if (chartType === "funnel") {
    return wrap(
      <FunnelChart>
        <Tooltip />
        <Funnel dataKey="value" data={chartData} isAnimationActive>
          <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
        </Funnel>
      </FunnelChart>,
    );
  }

  return (
    <div className="text-sm text-slate-500" style={{ height }}>
      Unsupported chart type: {chartType}
    </div>
  );
}
