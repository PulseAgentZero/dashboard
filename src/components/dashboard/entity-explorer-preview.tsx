"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { useEntities } from "@/hooks/entities/use-entities";
import type { EntityListItem } from "@/types/dashboard";

function Initial({ name }: { name: string | null }) {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-slate-100" />
            <div className="h-3 w-16 rounded bg-slate-50" />
          </div>
        </div>
      </td>
      <td className="py-3 pr-4"><div className="h-3.5 w-16 rounded bg-slate-100" /></td>
      <td className="py-3 pr-4"><div className="h-5 w-14 rounded-md bg-slate-100" /></td>
      <td className="py-3 pr-4"><div className="h-3.5 w-32 rounded bg-slate-100" /></td>
      <td className="py-3"><div className="h-3.5 w-10 rounded bg-slate-100" /></td>
    </tr>
  );
}

function EntityRow({ e }: { e: EntityListItem }) {
  return (
    <tr className="group text-sm hover:bg-slate-50/60">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <Initial name={e.entity_name} />
          <div>
            <p className="font-medium text-slate-900">
              {e.entity_name ?? e.entity_id}
            </p>
            <p className="text-[11px] text-slate-400">{e.entity_id}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-slate-500">{e.segment ?? "—"}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <RiskPill risk={e.risk_tier ?? "Low"} />
          <span className="text-xs tabular-nums text-slate-400">
            {e.risk_score.toFixed(0)}
          </span>
        </div>
      </td>
      <td className="max-w-50 py-3 pr-4">
        <p className="truncate text-sm text-slate-500">
          {e.risk_narrative
            ? e.risk_narrative.slice(0, 70) + (e.risk_narrative.length > 70 ? "…" : "")
            : "—"}
        </p>
      </td>
      <td className="py-3 text-right">
        {e.open_recommendations > 0 ? (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {e.open_recommendations} rec{e.open_recommendations > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
    </tr>
  );
}

export function EntityExplorerPreview() {
  const { data, isLoading } = useEntities({ limit: 8, risk_tier: "High" });

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Entity explorer
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900">
            High-risk profiles
          </h2>
        </div>
        <Link
          href="/dashboard/entities"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto px-5">
        <table className="w-full min-w-175 border-separate border-spacing-0">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {["Entity", "Segment", "Risk", "Signal", "Recs"].map((col, i) => (
                <th
                  key={col}
                  className={`border-b border-slate-100 pb-2.5 pt-4 text-left font-semibold ${i === 4 ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

            {!isLoading && (!data || data.entities.length === 0) && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                  No high-risk entities yet — run a pipeline to start profiling.
                </td>
              </tr>
            )}

            {data?.entities.map((e) => <EntityRow key={e.entity_id} e={e} />)}
          </tbody>
        </table>
      </div>

      {data && data.total > 8 && (
        <div className="border-t border-slate-100 px-5 py-3 text-center">
          <Link
            href="/dashboard/entities"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {(data.total - 8).toLocaleString()} more entities →
          </Link>
        </div>
      )}
    </div>
  );
}
