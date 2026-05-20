"use client";

import type { ChartRow } from "@/lib/usage-meters";

type Props = {
  data: ChartRow[];
};

export function UsageOverviewChart({ data }: Props) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((r) => r.limit), 1);

  return (
    <div className="flex flex-col gap-3" style={{ minHeight: 280 }}>
      {data.map((row) => (
        <div key={row.name}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-slate-700 max-w-[120px] md:max-w-[180px]">
              {row.name}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-slate-400">
              {row.used.toLocaleString()} / {row.limit.toLocaleString()}
            </span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{ width: `${(row.used / max) * 100}%`, background: row.fill }}
            />
          </div>
          <p className="mt-0.5 text-right font-mono text-[10px] text-slate-400">{row.pct}%</p>
        </div>
      ))}
    </div>
  );
}
