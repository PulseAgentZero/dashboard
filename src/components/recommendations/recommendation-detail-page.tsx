"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Target,
  TrendingUp,
} from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { useRecommendation } from "@/hooks/recommendations/use-recommendations";
import { useActionRecommendation, useDismissRecommendation } from "@/hooks/recommendations/use-recommendation-actions";
import { useEscalateRecommendation } from "@/hooks/recommendations/use-escalate-recommendation";
import { humanizeGeneratedText, humanizeRecommendationType, humanizeStatus } from "@/lib/readable-text";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />;
}

function DetailCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === "open"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : status === "actioned"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : status === "escalated"
          ? "border-orange-200 bg-orange-50 text-orange-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${colors}`}>
      {humanizeStatus(status)}
    </span>
  );
}

export function RecommendationDetailPage() {
  const params = useParams();
  const recommendationId = params.id ? decodeURIComponent(params.id as string) : undefined;
  const { data: recommendation, isLoading, isError } = useRecommendation(recommendationId);
  const { mutate: action, isPending: actioning, variables: actioningId } = useActionRecommendation();
  const { mutate: dismiss, isPending: dismissing, variables: dismissingId } = useDismissRecommendation();
  const { mutate: escalate, isPending: escalating, variables: escalatingId } = useEscalateRecommendation();

  const isActioning = actioning && actioningId?.id === recommendation?.id;
  const isDismissing = dismissing && dismissingId?.id === recommendation?.id;
  const isEscalating = escalating && escalatingId === recommendation?.id;
  const busy = isActioning || isDismissing || isEscalating;

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
        <Link href="/dashboard/recommendations" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={15} /> Back to recommendations
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
          <AlertTriangle size={32} className="mx-auto text-rose-400" />
          <p className="mt-3 text-sm font-medium text-rose-700">Recommendation not found or could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
      <Link
        href="/dashboard/recommendations"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={15} /> Back to recommendations
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <SkeletonBlock className="h-6 w-20" />
              <SkeletonBlock className="h-6 w-28" />
            </div>
            <SkeletonBlock className="h-7 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
        ) : recommendation ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <RiskPill risk={recommendation.urgency ?? "Low"} />
                <StatusBadge status={recommendation.status} />
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {humanizeRecommendationType(recommendation.type)}
                </span>
              </div>
              <h1 className="mt-3 text-lg sm:text-2xl font-semibold leading-tight text-slate-900 break-words">
                {humanizeGeneratedText(recommendation.title) || "Recommendation details"}
              </h1>
              {recommendation.entity_label && (
                <Link
                  href={`/dashboard/entities/${encodeURIComponent(recommendation.entity_id)}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 hover:underline break-all"
                >
                  View related record: {recommendation.entity_label}
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 lg:shrink-0">
              Created {new Date(recommendation.created_at).toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {[
          {
            label: "Priority",
            value: recommendation?.urgency ?? "Loading",
            sub: "How quickly to respond",
          },
          {
            label: "Confidence",
            value: recommendation?.confidence_score != null ? `${(recommendation.confidence_score * 100).toFixed(0)}%` : "Not shown",
            sub: "How strong the signal is",
          },
          {
            label: "Status",
            value: recommendation ? humanizeStatus(recommendation.status) : "Loading",
            sub: recommendation?.actioned_at ? `Updated ${new Date(recommendation.actioned_at).toLocaleDateString()}` : "Current state",
          },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:block">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:mt-1">{stat.sub}</p>
            </div>
            <p className="text-right text-lg sm:text-xl font-bold capitalize text-slate-900 sm:mt-2 sm:text-left break-words">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <DetailCard title="Why this matters" icon={<AlertTriangle size={14} className="text-amber-500" />}>
            {isLoading ? (
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-slate-700">
                {humanizeGeneratedText(recommendation?.reasoning) || "No explanation is available for this recommendation yet."}
              </p>
            )}
          </DetailCard>

          <DetailCard title="Recommended next step" icon={<Target size={14} className="text-orange-500" />}>
            {isLoading ? (
              <SkeletonBlock className="h-4 w-4/5" />
            ) : (
              <p className="text-sm leading-relaxed text-slate-700">
                {humanizeGeneratedText(recommendation?.suggested_action) || "No next step has been provided yet."}
              </p>
            )}
          </DetailCard>

          <DetailCard title="Expected result" icon={<TrendingUp size={14} className="text-emerald-500" />}>
            {isLoading ? (
              <SkeletonBlock className="h-4 w-3/5" />
            ) : (
              <p className="text-sm leading-relaxed text-slate-700">
                {humanizeGeneratedText(recommendation?.expected_impact) || "Expected impact is not available yet."}
              </p>
            )}
          </DetailCard>
        </div>

        <aside className="space-y-4">
          <DetailCard title="Actions">
            {isLoading ? (
              <div className="space-y-2">
                <SkeletonBlock className="h-9 w-full" />
                <SkeletonBlock className="h-9 w-full" />
              </div>
            ) : recommendation?.status === "open" ? (
              <div className="space-y-2">
                <button
                  disabled={busy}
                  onClick={() => action({ id: recommendation.id })}
                  className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  {isActioning ? "Marking as done..." : "Mark as done"}
                </button>
                <button
                  disabled={busy}
                  onClick={() => escalate(recommendation.id)}
                  className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50"
                >
                  {isEscalating ? "Escalating..." : "Escalate"}
                </button>
                <button
                  disabled={busy}
                  onClick={() => dismiss({ id: recommendation.id })}
                  className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {isDismissing ? "Dismissing..." : "Dismiss"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                {recommendation
                  ? `This recommendation is already ${humanizeStatus(recommendation.status).toLowerCase()}.`
                  : "This recommendation is not available."}
              </p>
            )}
          </DetailCard>

          <DetailCard title="Timeline" icon={<CalendarClock size={14} className="text-slate-400" />}>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</dt>
                <dd className="mt-0.5 text-slate-700 break-words">
                  {recommendation ? new Date(recommendation.created_at).toLocaleString() : "Loading"}
                </dd>
              </div>
              {recommendation?.expires_at && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Review by</dt>
                  <dd className="mt-0.5 text-slate-700 break-words">{new Date(recommendation.expires_at).toLocaleString()}</dd>
                </div>
              )}
              {recommendation?.actioned_at && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Marked done</dt>
                  <dd className="mt-0.5 text-slate-700 break-words">{new Date(recommendation.actioned_at).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </DetailCard>
        </aside>
      </div>
    </div>
  );
}
