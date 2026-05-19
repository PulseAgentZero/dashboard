"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartRow } from "@/lib/usage-meters";

type Props = {
  data: ChartRow[];
};

export function UsageOverviewChart({ data }: Props) {
  if (data.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={72}
          tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const row = payload[0].payload as ChartRow;
            return (
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
                <p className="text-xs font-semibold text-slate-800">{row.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {row.used.toLocaleString()} / {row.limit.toLocaleString()} used
                </p>
                <p className="text-xs text-slate-500">{row.pct}% of limit</p>
              </div>
            );
          }}
        />
        <Bar dataKey="used" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
