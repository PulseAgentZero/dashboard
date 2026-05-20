"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, TrendingUp, X, Zap, ArrowUp } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { RiskPill } from "@/components/shared/risk-pill";
import { useRecommendations } from "@/hooks/recommendations/use-recommendations";
import { useActionRecommendation, useDismissRecommendation } from "@/hooks/recommendations/use-recommendation-actions";
import { useEscalateRecommendation } from "@/hooks/recommendations/use-escalate-recommendation";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";
import { humanizeGeneratedText, humanizeRecommendationType, humanizeStatus } from "@/lib/readable-text";

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

  const total = data?.total ?? 0;

  function handleTabChange(t: StatusTab) {
    setStatus(t);
    setPage(1);
  }

  function handleUrgencyChange(u: UrgencyFilter) {
    setUrgency(u);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Recommendations</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            See the actions Entivia recommends and why they matter.
          </p>
        </div>
        {data && (
          <span className="self-start sm:self-auto rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500">
            {data.total.toLocaleString()} {humanizeStatus(status).toLowerCase()}
          </span>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {[
          {
            label: "Active",
            value: (overview?.active_recommendations ?? 0).toLocaleString(),
            sub: "Open recommendations",
            color: "text-slate-900",
          },
          {
            label: "Critical",
            value: (overview?.critical_recommendations ?? 0).toLocaleString(),
            sub: "Need attention now",
            color: "text-rose-600",
          },
          {
            label: "Coverage",
            value: (overview?.total_entities ?? 0).toLocaleString(),
            sub: "Records reviewed",
            color: "text-slate-900",
          },
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between items-center rounded-xl border border-slate-200 bg-white p-4 sm:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:mt-1">{stat.sub}</p>
            </div>
            <p className={`text-2xl font-bold sm:mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Tabs + urgency filter with touch-friendly responsive layout */}
        <div className="px-4 pt-4 sm:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-0.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {STATUS_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    status === t
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {humanizeStatus(t)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-3 md:pb-0 no-scrollbar">
              {URGENCY_FILTERS.map((u) => (
                <button
                  key={u}
                  onClick={() => handleUrgencyChange(u)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    urgency === u
                      ? "bg-orange-600 text-white" 
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
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 sm:p-5"><SkeletonCard /></div>
          ))}

          {!isLoading && (!data || data.recommendations.length === 0) && (
            <div className="py-16 text-center px-4">
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
              <article key={rec.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskPill risk={rec.urgency ?? "Low"} />
                      {rec.type && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {humanizeRecommendationType(rec.type)}
                        </span>
                      )}
                      {rec.confidence_score != null && (
                        <span className="text-xs text-slate-500 sm:hidden">
                          Confidence: {(rec.confidence_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-sm font-semibold text-slate-900 leading-snug">
                      <Link
                        href={`/dashboard/recommendations/${encodeURIComponent(rec.id)}`}
                        className="transition-colors hover:text-orange-700 hover:underline"
                      >
                        {humanizeGeneratedText(rec.title) || "Untitled recommendation"}
                      </Link>
                    </h2>
                    {rec.entity_label && (
                      <Link
                        href={`/dashboard/entities/${encodeURIComponent(rec.entity_id)}`}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                      >
                        {rec.entity_label}
                      </Link>
                    )}
                    {rec.reasoning && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                        {humanizeGeneratedText(rec.reasoning)}
                      </p>
                    )}
                    {rec.suggested_action && (
                      <p className="mt-2 text-xs font-medium text-slate-700">
                        Next step: {humanizeGeneratedText(rec.suggested_action)}
                      </p>
                    )}
                  </div>

                  {rec.confidence_score != null && (
                    <div className="hidden shrink-0 self-start rounded-lg border border-slate-200 bg-white p-2.5 text-center min-w-20 sm:block sm:self-auto">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Confidence</p>
                      <p className="mt-0.5 text-lg font-bold text-slate-900">
                        {(rec.confidence_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>

                {rec.expected_impact && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <TrendingUp size={11} />
                    {rec.expected_impact}
                  </p>
                )}

                {status === "open" && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-2">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        disabled={busy}
                        onClick={() => action({ id: rec.id })}
                        aria-label="Mark as done"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50 sm:flex-none sm:py-1.5"
                      >
                        <Check size={14} className="md:hidden" />
                        <span className="hidden md:inline">
                          {isActioning ? "Marking done…" : "Mark as done"}
                        </span>
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => escalate(rec.id)}
                        aria-label="Escalate"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50 sm:flex-none sm:py-1.5"
                      >
                        <ArrowUp size={14} className="md:hidden" />
                        <span className="hidden md:inline">
                          {isEscalating ? "Escalating…" : "Escalate"}
                        </span>
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => dismiss({ id: rec.id })}
                        aria-label="Dismiss"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:flex-none sm:py-1.5"
                      >
                        <X size={14} className="md:hidden" />
                        <span className="hidden md:inline">
                          {isDismissing ? "Dismissing…" : "Dismiss"}
                        </span>
                      </button>
                    </div>
                    <Link
                      href={`/dashboard/recommendations/${encodeURIComponent(rec.id)}`}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors sm:ml-2"
                    >
                      View details
                    </Link>
                    <p className="text-[10px] text-slate-400 sm:ml-auto">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {status !== "open" && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                    {rec.actioned_by && <span>Marked done</span>}
                    {rec.actioned_at && <span>{new Date(rec.actioned_at).toLocaleString()}</span>}
                    <span className="sm:ml-auto">Created {new Date(rec.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <Pagination
          page={page}
          pageSize={LIMIT}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}