"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { RiskPill } from "@/components/shared/risk-pill";
import { useEntities } from "@/hooks/entities/use-entities";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

const RISK_TIERS = ["All", "High", "Medium", "Low", "Healthy"] as const;
type RiskTier = (typeof RISK_TIERS)[number];

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[180, 100, 80, 120, 80].map((w, i) => (
        <td key={i} className="border-b border-slate-100 py-3.5 pr-5">
          <div className="h-3.5 rounded bg-slate-100" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function Initial({ name }: { name: string | null }) {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 select-none">
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

export function EntitiesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [riskTier, setRiskTier] = useState<RiskTier>("All");
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const { data, isLoading } = useEntities({
    search: debouncedSearch || undefined,
    risk_tier: riskTier === "All" ? undefined : riskTier,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const { data: overview } = useDashboardOverview();
  const dist = overview?.risk_distribution;

  const total = data?.total ?? 0;

  function handleSearch(v: string) {
    setSearch(v);
    startTransition(() => {
      setDebouncedSearch(v);
      setPage(1);
    });
  }

  function handleTier(t: RiskTier) {
    setRiskTier(t);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-350 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Entity explorer</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Search, rank, and investigate every profiled entity.
          </p>
        </div>
        {data && data.total > 0 && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            {data.total.toLocaleString()} entities
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total entities" value={(overview?.total_entities ?? 0).toLocaleString()} sub="Across all segments" color="text-slate-900" />
        <StatCard label="High risk" value={(dist?.High ?? 0).toLocaleString()} sub="Need attention" color="text-rose-600" />
        <StatCard label="Medium risk" value={(dist?.Medium ?? 0).toLocaleString()} sub="Monitor closely" color="text-amber-600" />
        <StatCard label="Healthy" value={((dist?.Low ?? 0) + (dist?.Healthy ?? 0)).toLocaleString()} sub="Low and healthy" color="text-emerald-600" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search size={15} className="shrink-0 text-slate-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Search by name or ID…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {RISK_TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTier(t)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    riskTier === t
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 border-separate border-spacing-0">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {["Entity", "Segment", "Risk tier", "Risk score", "Open recs"].map((col, i) => (
                  <th
                    key={col}
                    className={`border-b border-slate-100 px-5 pb-3 pt-4 text-left font-semibold ${i === 4 ? "text-right" : ""}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

              {!isLoading && (!data || data.entities.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-slate-400">
                    {search || riskTier !== "All"
                      ? "No entities match your filters."
                      : "No entities profiled yet — run a pipeline to get started."}
                  </td>
                </tr>
              )}

              {data?.entities.map((e) => (
                <tr key={e.entity_id} className="group text-sm hover:bg-slate-50/60">
                  <td className="border-b border-slate-100 px-5 py-3.5">
                    <Link
                      href={`/dashboard/entities/${encodeURIComponent(e.entity_id)}`}
                      className="flex items-center gap-3"
                    >
                      <Initial name={e.entity_name} />
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {e.entity_name ?? e.entity_id}
                        </p>
                        <p className="text-[11px] text-slate-400">{e.entity_id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="border-b border-slate-100 px-5 py-3.5 text-sm text-slate-500">
                    {e.segment ?? "—"}
                  </td>
                  <td className="border-b border-slate-100 px-5 py-3.5">
                    <RiskPill risk={e.risk_tier ?? "Low"} />
                  </td>
                  <td className="border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-1.5 rounded-full ${
                            e.risk_score >= 70 ? "bg-rose-500" : e.risk_score >= 40 ? "bg-amber-400" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(e.risk_score, 100)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs text-slate-500">{e.risk_score.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="border-b border-slate-100 px-5 py-3.5 text-right">
                    {e.open_recommendations > 0 ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        {e.open_recommendations}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

                <Pagination
          page={page}
          pageSize={DEFAULT_PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
