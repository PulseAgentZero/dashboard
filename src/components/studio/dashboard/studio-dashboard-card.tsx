"use client";

import Link from "next/link";
import { ChevronRight, Globe, Rows3 } from "lucide-react";
import { DashboardLayoutPreview } from "@/components/studio/dashboard/dashboard-layout-preview";
import { StarButton } from "@/components/studio/ui/star-button";
import { resolveDashboardLayout } from "@/lib/studio/dashboard-layout";
import type { StudioDashboard } from "@/types/studio";

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TagPills({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((t) => (
        <span
          key={t}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

type Props = {
  dashboard: StudioDashboard;
  onStar: () => void;
};

export function StudioDashboardCard({ dashboard, onStar }: Props) {
  const panelCount = dashboard.items?.length ?? dashboard.layout?.length ?? 0;
  const layout = resolveDashboardLayout(dashboard.items ?? [], dashboard.layout);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <Link href={`/dashboard/studio/dashboards/${dashboard.id}`} className="block p-3 pb-0">
        <DashboardLayoutPreview layout={layout} />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/studio/dashboards/${dashboard.id}`}
                className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-indigo-600"
              >
                {dashboard.name}
              </Link>
              {dashboard.is_public && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <Globe size={10} />
                  Public
                </span>
              )}
            </div>
            {dashboard.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{dashboard.description}</p>
            )}
          </div>
          <StarButton starred={dashboard.starred} onToggle={onStar} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Rows3 size={12} />
            {panelCount} panel{panelCount === 1 ? "" : "s"}
          </span>
          <span>Updated {formatRelative(dashboard.updated_at)}</span>
        </div>

        <div className="mt-2">
          <TagPills tags={dashboard.tags} />
        </div>

        <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
          <Link
            href={`/dashboard/studio/dashboards/${dashboard.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Open
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
