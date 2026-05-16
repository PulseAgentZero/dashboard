"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { useEntity, useEntityRiskHistory } from "@/hooks/entities/use-entity";

function Initial({ name }: { name: string | null }) {
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-500 select-none">
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />;
}

function RiskHistoryChart({ points }: { points: { risk_score: number; recorded_at: string }[] }) {
  if (points.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        No history data available.
      </div>
    );
  }

  const max = Math.max(...points.map((p) => p.risk_score), 1);
  const recent = points.slice(-30);

  return (
    <div className="flex h-40 items-end gap-1">
      {recent.map((p, i) => {
        const pct = (p.risk_score / max) * 100;
        const color =
          p.risk_score >= 70 ? "bg-rose-400" : p.risk_score >= 40 ? "bg-amber-400" : "bg-emerald-400";
        return (
          <div key={i} className="group relative flex flex-1 flex-col justify-end">
            <div
              className={`${color} rounded-t transition-all`}
              style={{ height: `${Math.max(pct, 4)}%` }}
            />
            <div className="absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
              {p.risk_score.toFixed(0)} · {new Date(p.recorded_at).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileDataTable({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v != null);
  if (entries.length === 0) return <p className="text-sm text-slate-400">No profile data.</p>;

  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{k.replace(/_/g, " ")}</dt>
          <dd className="mt-0.5 text-sm text-slate-700 break-all">{String(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EntityProfilePage() {
  const params = useParams();
  const entityId = decodeURIComponent(params.id as string);

  const { data: entity, isLoading, isError } = useEntity(entityId);
  const { data: history } = useEntityRiskHistory(entityId, "30d");

  if (isError) {
    return (
      <div className="mx-auto max-w-8xl space-y-5">
        <Link href="/dashboard/entities" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={15} /> Back to entities
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
          <AlertTriangle size={32} className="mx-auto text-rose-400" />
          <p className="mt-3 text-sm font-medium text-rose-700">Entity not found or could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <Link
        href="/dashboard/entities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={15} /> Back to entities
      </Link>

      {/* Header card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-16 w-16 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-5 w-48" />
              <SkeletonBlock className="h-3.5 w-32" />
            </div>
          </div>
        ) : entity ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Initial name={entity.entity_name} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <RiskPill risk={entity.risk_tier ?? "Low"} />
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                    Score {entity.risk_score.toFixed(0)}
                  </span>
                  {entity.segment && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {entity.segment}
                    </span>
                  )}
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                  {entity.entity_name ?? entity.entity_id}
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">{entity.entity_id}</p>
              </div>
            </div>
            {entity.last_pipeline_run_at && (
              <p className="shrink-0 text-xs text-slate-400">
                Last run: {new Date(entity.last_pipeline_run_at).toLocaleString()}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Risk score bar */}
      {!isLoading && entity && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Risk score",
              value: entity.risk_score.toFixed(1),
              sub: entity.risk_tier ?? "Unknown tier",
              color: entity.risk_score >= 70 ? "text-rose-600" : entity.risk_score >= 40 ? "text-amber-600" : "text-emerald-600",
            },
            {
              label: "Open recs",
              value: entity.recommendations.filter((r) => r.status === "open").length,
              sub: "Pending action",
              color: "text-slate-900",
            },
            {
              label: "Total recs",
              value: entity.recommendations.length,
              sub: "All time",
              color: "text-slate-900",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {/* Risk narrative */}
          {!isLoading && entity?.risk_narrative && (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Risk narrative</p>
              <p className="text-sm leading-relaxed text-slate-700">{entity.risk_narrative}</p>
            </div>
          )}

          {/* Risk history chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Risk score history · 30 days
            </p>
            {isLoading ? (
              <SkeletonBlock className="h-40 w-full" />
            ) : (
              <RiskHistoryChart points={history?.points ?? []} />
            )}
          </div>

          {/* Profile data */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Profile data</p>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-3.5 w-full" />
                ))}
              </div>
            ) : entity ? (
              <ProfileDataTable data={entity.profile_data} />
            ) : null}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Privacy posture */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Data governance</p>
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Entity data is read from connected sources on demand. Pulse stores recommendation metadata only — not raw records.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Recommendations</p>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : !entity || entity.recommendations.length === 0 ? (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <p className="mt-2 text-xs text-slate-500">No recommendations open.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {entity.recommendations.map((rec) => (
                  <div key={rec.id} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      {rec.urgency && <RiskPill risk={rec.urgency} />}
                      {rec.status && (
                        <span className={`text-[10px] font-semibold ${
                          rec.status === "open" ? "text-amber-600" : "text-slate-400"
                        }`}>
                          {rec.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-slate-800 line-clamp-2">
                      {rec.title ?? "Untitled"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={9} />
                      {new Date(rec.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Link
                  href="/dashboard/recommendations"
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  View all recommendations <TrendingUp size={11} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
