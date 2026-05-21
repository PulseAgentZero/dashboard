"use client";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
};

function StatCard({ label, value, sub, color = "text-slate-900" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

type Props = {
  queriesTotal: number;
  dashboardsTotal: number;
  starredTotal: number;
  runsToday?: { used: number; limit: number | null };
};

export function StudioHomeStats({
  queriesTotal,
  dashboardsTotal,
  starredTotal,
  runsToday,
}: Props) {
  const runsLabel =
    runsToday != null
      ? runsToday.limit != null
        ? `${runsToday.used} / ${runsToday.limit}`
        : `${runsToday.used}`
      : "—";

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Saved queries" value={queriesTotal.toLocaleString()} sub="Across your org" />
      <StatCard
        label="Dashboards"
        value={dashboardsTotal.toLocaleString()}
        sub="Custom layouts"
        color="text-violet-600"
      />
      <StatCard
        label="Starred"
        value={starredTotal.toLocaleString()}
        sub="Queries and dashboards"
        color="text-amber-600"
      />
      <StatCard
        label="Runs today"
        value={runsLabel}
        sub={
          runsToday?.limit != null ? "Studio execution budget" : runsToday ? "No daily cap" : "Usage unavailable"
        }
        color="text-indigo-600"
      />
    </div>
  );
}
