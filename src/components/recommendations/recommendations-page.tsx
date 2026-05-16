"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Zap } from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { useRecommendations } from "@/hooks/recommendations/use-recommendations";
import { useActionRecommendation, useDismissRecommendation } from "@/hooks/recommendations/use-recommendation-actions";
import { useEscalateRecommendation } from "@/hooks/recommendations/use-escalate-recommendation";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

const STATUS_TABS = ["open", "actioned", "dismissed", "escalated"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const URGENCY_FILTERS = ["All", "Critical", "High", "Medium", "Low"] as const;
type UrgencyFilter = (typeof URGENCY_FILTERS)[number];

const LIMIT = 15;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-14 rounded-md bg-slate-100" />
        <div className="h-5 w-20 rounded-md bg-slate-100" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1.5 h-3 w-5/6 rounded bg-slate-100" />
      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        {[60, 60, 60].map((w, i) => (
          <div key={i} className="h-7 rounded-lg bg-slate-100" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

export function RecommendationsPage() {
  const [status, setStatus] = useState<StatusTab>("open");
  const [urgency, setUrgency] = useState<UrgencyFilter>("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useRecommendations({
    status,
    urgency: urgency === "All" ? undefined : urgency,
    page,
    limit: LIMIT,
  });

  const { data: overview } = useDashboardOverview();
  const { mutate: action, isPending: actioning, variables: actioningId } = useActionRecommendation();
  const { mutate: dismiss, isPending: dismissing, variables: dismissingId } = useDismissRecommendation();
  const { mutate: escalate, isPending: escalating, variables: escalatingId } = useEscalateRecommendation();

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  function handleTabChange(t: StatusTab) {
    setStatus(t);
    setPage(1);
  }

  function handleUrgencyChange(u: UrgencyFilter) {
    setUrgency(u);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Recommendations</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Prioritized next-best actions generated from risk patterns.
          </p>
        </div>
        {data && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            {data.total.toLocaleString()} {status}
          </span>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(overview?.active_recommendations ?? 0).toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Open recommendations</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Critical</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {(overview?.critical_recommendations ?? 0).toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Require immediate action</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Coverage</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(overview?.total_entities ?? 0).toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Entities profiled</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Tabs + urgency filter */}
        <div className="border-b border-slate-100 px-5 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-0.5">
              {STATUS_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    status === t
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-1 pb-3 sm:pb-0">
              {URGENCY_FILTERS.map((u) => (
                <button
                  key={u}
                  onClick={() => handleUrgencyChange(u)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    urgency === u
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5"><SkeletonCard /></div>
          ))}

          {!isLoading && (!data || data.recommendations.length === 0) && (
            <div className="py-16 text-center">
              <Zap size={32} className="mx-auto text-slate-200" />
              <p className="mt-3 text-sm font-medium text-slate-500">No {status} recommendations</p>
              <p className="mt-1 text-xs text-slate-400">
                {urgency !== "All" ? "Try clearing the urgency filter." : "Run a pipeline to generate recommendations."}
              </p>
            </div>
          )}

          {data?.recommendations.map((rec) => {
            const isActioning = actioning && actioningId?.id === rec.id;
            const isDismissing = dismissing && dismissingId?.id === rec.id;
            const isEscalating = escalating && escalatingId === rec.id;
            const busy = isActioning || isDismissing || isEscalating;

            return (
              <article key={rec.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskPill risk={rec.urgency ?? "Low"} />
                      {rec.type && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {rec.type}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2.5 text-sm font-semibold text-slate-900">
                      {rec.title ?? "Untitled recommendation"}
                    </h2>
                    {rec.entity_label && (
                      <Link
                        href={`/dashboard/entities/${encodeURIComponent(rec.entity_id)}`}
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        {rec.entity_label}
                      </Link>
                    )}
                    {rec.reasoning && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                        {rec.reasoning}
                      </p>
                    )}
                    {rec.suggested_action && (
                      <p className="mt-2 text-xs font-medium text-slate-700">
                        Action: {rec.suggested_action}
                      </p>
                    )}
                  </div>

                  {rec.confidence_score != null && (
                    <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-3 text-center min-w-20">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Confidence</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {(rec.confidence_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>

                {rec.expected_impact && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                    <TrendingUp size={11} />
                    {rec.expected_impact}
                  </p>
                )}

                {status === "open" && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <button
                      disabled={busy}
                      onClick={() => action({ id: rec.id })}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      {isActioning ? "Actioning…" : "Mark actioned"}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => escalate(rec.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                    >
                      {isEscalating ? "Escalating…" : "Escalate"}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => dismiss({ id: rec.id })}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {isDismissing ? "Dismissing…" : "Dismiss"}
                    </button>
                    <p className="ml-auto text-[10px] text-slate-400">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {status !== "open" && (
                  <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
                    {rec.actioned_by && (
                      <span className="text-[10px] text-slate-400">
                        By {rec.actioned_by}
                      </span>
                    )}
                    {rec.actioned_at && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(rec.actioned_at).toLocaleString()}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-slate-400">
                      Created {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages} · {data?.total.toLocaleString()} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
