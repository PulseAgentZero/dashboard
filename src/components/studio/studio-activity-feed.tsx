"use client";

import Link from "next/link";
import { FileCode2, LayoutDashboard } from "lucide-react";
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

export type ActivityEntry = {
  id: string;
  kind: "query" | "dashboard";
  name: string;
  href: string;
  timestamp: string;
  detail: string;
};

export function buildStudioActivity(
  queries: StudioQuery[],
  dashboards: StudioDashboard[],
  limit = 12,
): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  for (const query of queries) {
    const ts = query.last_run_at ?? query.updated_at;
    let detail = `Updated ${formatRelative(query.updated_at)}`;
    if (query.last_run_at) {
      detail = `Ran ${formatRelative(query.last_run_at)}`;
      if (query.last_run_row_count != null) {
        detail += ` · ${query.last_run_row_count.toLocaleString()} rows`;
      }
    }
    entries.push({
      id: `q-${query.id}`,
      kind: "query",
      name: query.name,
      href: `/dashboard/studio/queries/${query.id}`,
      timestamp: ts,
      detail,
    });
  }

  for (const dashboard of dashboards) {
    const panelCount = dashboard.items?.length ?? dashboard.layout?.length ?? 0;
    entries.push({
      id: `d-${dashboard.id}`,
      kind: "dashboard",
      name: dashboard.name,
      href: `/dashboard/studio/dashboards/${dashboard.id}`,
      timestamp: dashboard.updated_at,
      detail: `Updated ${formatRelative(dashboard.updated_at)} · ${panelCount} panel${panelCount === 1 ? "" : "s"}`,
    });
  }

  return entries
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

type Props = {
  entries: ActivityEntry[];
};

export function StudioActivityFeed({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        <p className="mt-0.5 text-xs text-slate-500">Recently run queries and updated dashboards</p>
      </div>
      <ul className="divide-y divide-slate-100">
        {entries.map((entry) => {
          const Icon = entry.kind === "query" ? FileCode2 : LayoutDashboard;
          return (
            <li key={entry.id}>
              <Link
                href={entry.href}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/80"
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    entry.kind === "query"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.detail}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
