import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { metrics } from "@/lib/demo-data";

type Metric = (typeof metrics)[number];

export function MetricCard({ metric }: { metric: Metric }) {
  const improving = metric.trend === "down";
  const Icon = improving ? ArrowDownRight : ArrowUpRight;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {metric.value}
          </p>
        </div>
        <span
          className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold ${
            improving
              ? "bg-emerald-50 text-emerald-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <Icon size={14} />
          {metric.delta}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-500">{metric.detail}</p>
    </section>
  );
}

export function MetricsGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}
