"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { useRecommendations } from "@/hooks/recommendations/use-recommendations";
import {
  useActionRecommendation,
  useDismissRecommendation,
} from "@/hooks/recommendations/use-recommendation-actions";
import type { Recommendation } from "@/types/dashboard";

function SkeletonItem() {
  return (
    <div className="animate-pulse space-y-2 border-b border-slate-100 px-4 py-4 last:border-0 sm:px-5">
      <div className="flex justify-between">
        <div className="h-3.5 w-36 rounded bg-slate-100" />
        <div className="h-5 w-14 rounded-md bg-slate-100" />
      </div>
      <div className="h-3 w-24 rounded bg-slate-50" />
      <div className="h-8 w-full rounded bg-slate-50" />
    </div>
  );
}

function RecItem({ rec }: { rec: Recommendation }) {
  const { mutate: action, isPending: actioning } = useActionRecommendation();
  const { mutate: dismiss, isPending: dismissing } = useDismissRecommendation();
  const busy = actioning || dismissing;

  const urgency = rec.urgency
    ? rec.urgency.charAt(0).toUpperCase() + rec.urgency.slice(1)
    : "Low";

  const pct =
    rec.confidence_score != null
      ? Math.round(rec.confidence_score * 100)
      : null;

  return (
    <div className="border-b border-slate-100 px-4 py-4 last:border-0 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {rec.title ?? "Recommendation"}
        </p>
        <div className="shrink-0">
          <RiskPill risk={urgency} />
        </div>
      </div>

      <p className="mt-1 text-[11px] text-slate-400">
        {rec.entity_label ?? rec.entity_id}
        {pct != null ? ` · ${pct}% confidence` : ""}
      </p>

      {rec.reasoning && (
        <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-2">
          {rec.reasoning}
        </p>
      )}

      {/* Buttons: Full width on mobile, natural sizing on desktop */}
      <div className="mt-3 flex gap-2 w-full sm:w-auto">
        <button
          disabled={busy}
          onClick={() => action({ id: rec.id })}
          className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          <CheckCircle2 size={11} />
          Action
        </button>
        <button
          disabled={busy}
          onClick={() => dismiss({ id: rec.id })}
          className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <X size={11} />
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function RecommendationsPanel() {
  const { data, isLoading } = useRecommendations({ status: "open", limit: 6 });

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white">
      {/* Header adjustments to prevent component squishing */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="min-w-0 pr-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Recommendations
          </p>
          <h2 className="mt-0.5 flex items-center gap-1.5 text-base font-semibold text-slate-900">
            <span className="truncate">Action queue</span>
            {data && data.total > 0 && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 shrink-0">
                {data.total}
              </span>
            )}
          </h2>
        </div>
        <Link
          href="/dashboard/recommendations"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:px-3"
        >
          <span className="hidden xs:inline">View all</span>
          <span className="xs:hidden">All</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {isLoading && (
        <>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </>
      )}

      {!isLoading && (!data || data.recommendations.length === 0) && (
        <div className="px-4 py-12 text-center sm:px-5">
          <p className="text-sm font-medium text-slate-600">No open recommendations</p>
          <p className="mt-1 text-xs text-slate-400">
            Run a pipeline to generate AI-powered actions.
          </p>
        </div>
      )}

      {data?.recommendations.map((rec) => (
        <RecItem key={rec.id} rec={rec} />
      ))}
    </div>
  );
}