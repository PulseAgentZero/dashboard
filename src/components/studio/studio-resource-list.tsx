"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  FileCode2,
  Globe,
  LayoutDashboard,
  Loader2,
  Play,
  Rows3,
} from "lucide-react";
import { StarButton } from "@/components/studio/ui/star-button";
import type { StudioDashboard, StudioQuery } from "@/types/studio";

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTimestamp(dateStr: string) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TagPills({ tags }: { tags?: string[] }) {
  if (!tags?.length) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((t) => (
        <span
          key={t}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 max-w-[100px] truncate"
        >
          {t}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="text-[10px] font-medium text-slate-400 self-center">+{tags.length - 3}</span>
      )}
    </div>
  );
}

export function QueryListRow({
  query,
  onStar,
  onRun,
  running,
  compact = false,
}: {
  query: StudioQuery;
  onStar: () => void;
  onRun: () => void;
  running?: boolean;
  compact?: boolean;
}) {
  const activity = query.last_run_at
    ? `Ran ${formatRelative(query.last_run_at)}`
    : "Never run";
  const detail =
    query.last_run_row_count != null
      ? `${query.last_run_row_count.toLocaleString()} rows`
      : query.refresh_enabled
        ? "Scheduled refresh"
        : null;

  if (compact) {
    return (
      <div className="group flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-orange-50/20 transition-colors">
        <Link href={`/dashboard/studio/queries/${query.id}`} className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
            {query.name}
          </p>
          <p className="truncate text-xs text-slate-400 mt-0.5">
            {detail ? `${activity} · ${detail}` : activity}
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <StarButton starred={query.starred} onToggle={onStar} />
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            title="Run query"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 transition-colors"
          >
            {running ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Play size={15} />
            )}
          </button>
          <Link
            href={`/dashboard/studio/queries/${query.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center sm:items-stretch gap-3 sm:gap-4 border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4 last:border-b-0 hover:bg-orange-50/20 transition-colors">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100/70">
        <FileCode2 size={18} className="text-orange-600" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Link
            href={`/dashboard/studio/queries/${query.id}`}
            className="text-sm font-semibold text-slate-900 hover:text-orange-600 break-words line-clamp-1 transition-colors"
          >
            {query.name}
          </Link>
          {query.starred && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-100/50">
              Starred
            </span>
          )}
        </div>
        {query.description && (
          <p className="mt-0.5 line-clamp-1 text-xs sm:text-sm text-slate-500">{query.description}</p>
        )}
        
        {/* Responsive sub-metadata layer */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 md:hidden">
          <span>{activity}</span>
          {detail && <span>• {detail}</span>}
        </div>

        <div className="mt-2 hidden sm:block">
          <TagPills tags={query.tags} />
        </div>
      </div>

      <div className="hidden min-w-[140px] flex-col justify-center text-right md:flex">
        <p className="text-xs font-medium text-slate-600">{activity}</p>
        {detail && <p className="mt-0.5 text-[11px] text-slate-400">{detail}</p>}
        <p className="mt-0.5 text-[10px] text-slate-400">
          Updated {formatRelative(query.updated_at)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 self-center">
        <StarButton starred={query.starred} onToggle={onStar} />
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          title="Run query"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
        >
          {running ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
        </button>
        <Link
          href={`/dashboard/studio/queries/${query.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="Open query"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export function DashboardListRow({
  dashboard,
  onStar,
  compact = false,
}: {
  dashboard: StudioDashboard;
  onStar: () => void;
  compact?: boolean;
}) {
  const panelCount = dashboard.items?.length ?? dashboard.layout?.length ?? 0;

  if (compact) {
    return (
      <div className="group flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-orange-50/20 transition-colors">
        <Link
          href={`/dashboard/studio/dashboards/${dashboard.id}`}
          className="min-w-0 flex-1"
        >
          <p className="truncate text-sm font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
            {dashboard.name}
            {dashboard.is_public && (
              <span className="ml-2 inline-flex items-center rounded bg-slate-100 px-1 py-0.5 text-[10px] font-normal text-slate-500">Public</span>
            )}
          </p>
          <p className="truncate text-xs text-slate-400 mt-0.5">
            {panelCount} panel{panelCount === 1 ? "" : "s"} · {formatRelative(dashboard.updated_at)}
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <StarButton starred={dashboard.starred} onToggle={onStar} />
          <Link
            href={`/dashboard/studio/dashboards/${dashboard.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center sm:items-stretch gap-3 sm:gap-4 border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4 last:border-b-0 hover:bg-orange-50/20 transition-colors">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100/70">
        <LayoutDashboard size={18} className="text-orange-600" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Link
            href={`/dashboard/studio/dashboards/${dashboard.id}`}
            className="text-sm font-semibold text-slate-900 hover:text-orange-600 break-words line-clamp-1 transition-colors"
          >
            {dashboard.name}
          </Link>
          {dashboard.is_public && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100/50">
              <Globe size={10} />
              Public
            </span>
          )}
        </div>
        {dashboard.description && (
          <p className="mt-0.5 line-clamp-1 text-xs sm:text-sm text-slate-500">{dashboard.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium text-slate-500">
            <Rows3 size={12} />
            {panelCount} panel{panelCount === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1 md:hidden">
            <Clock size={12} />
            {formatRelative(dashboard.updated_at)}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Clock size={12} />
            Updated {formatRelative(dashboard.updated_at)}
          </span>
        </div>
        <div className="mt-2 hidden lg:block">
          <TagPills tags={dashboard.tags} />
        </div>
      </div>

      <div className="hidden min-w-[140px] flex-col justify-center text-right md:flex">
        <p className="text-xs font-medium text-slate-600">
          {formatRelative(dashboard.updated_at)}
        </p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          {formatTimestamp(dashboard.updated_at)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 self-center">
        <StarButton starred={dashboard.starred} onToggle={onStar} />
        <Link
          href={`/dashboard/studio/dashboards/${dashboard.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="Open dashboard"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export function StudioListSkeleton({
  rows = 5,
  compact = false,
}: {
  rows?: number;
  compact?: boolean;
}) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) =>
        compact ? (
          <div key={i} className="px-4 py-3.5">
            <div className="h-4 w-1/2 max-w-[180px] animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-1/3 max-w-[100px] animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-5">
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 animate-pulse rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2 py-0.5">
              <div className="h-4 w-1/3 max-w-[200px] animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-3/4 max-w-md animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function StudioListEmpty({
  kind,
  canCreate,
  onCreateDashboard,
}: {
  kind: "queries" | "dashboards";
  canCreate: boolean;
  onCreateDashboard?: () => void;
}) {
  const isQueries = kind === "queries";
  const Icon = isQueries ? FileCode2 : LayoutDashboard;

  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:px-6">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 ring-1 ring-orange-100/70">
        <Icon size={26} className="text-orange-600" />
      </div>
      <p className="mt-5 text-base font-semibold text-slate-800">
        No {isQueries ? "queries" : "dashboards"} yet
      </p>
      <p className="mt-1.5 max-w-xs text-xs sm:text-sm text-slate-500 leading-relaxed">
        {isQueries
          ? "Write SQL against your connected data and save results for dashboards."
          : "Combine saved queries into panels to monitor metrics at a glance."}
      </p>
      {canCreate &&
        (isQueries ? (
          <Link
            href="/dashboard/studio/queries/new"
            className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 shadow-xs transition-colors"
          >
            <FileCode2 size={16} />
            Create your first query
          </Link>
        ) : (
          <button
            type="button"
            onClick={onCreateDashboard}
            className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 shadow-xs transition-colors"
          >
            <LayoutDashboard size={16} />
            Create your first dashboard
          </button>
        ))}
    </div>
  );
}