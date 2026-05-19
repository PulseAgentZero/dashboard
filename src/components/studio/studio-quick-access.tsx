"use client";

import Link from "next/link";
import { FileCode2, LayoutDashboard } from "lucide-react";
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

type QuickItem =
  | { kind: "query"; item: StudioQuery }
  | { kind: "dashboard"; item: StudioDashboard };

type Props = {
  queries: StudioQuery[];
  dashboards: StudioDashboard[];
  onStarQuery: (id: string, starred: boolean) => void;
  onStarDashboard: (id: string, starred: boolean) => void;
};

export function StudioQuickAccess({
  queries,
  dashboards,
  onStarQuery,
  onStarDashboard,
}: Props) {
  const items: QuickItem[] = [
    ...queries.map((item) => ({ kind: "query" as const, item })),
    ...dashboards.map((item) => ({ kind: "dashboard" as const, item })),
  ];

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-900">Starred</h2>
      <p className="mt-0.5 text-xs text-slate-500">Quick access to your pinned queries and dashboards</p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {items.map((entry) => {
          const isQuery = entry.kind === "query";
          const href = isQuery
            ? `/dashboard/studio/queries/${entry.item.id}`
            : `/dashboard/studio/dashboards/${entry.item.id}`;
          const activity =
            entry.kind === "query"
              ? entry.item.last_run_at
                ? `Ran ${formatRelative(entry.item.last_run_at)}`
                : "Never run"
              : `Updated ${formatRelative(entry.item.updated_at)}`;
          const Icon = isQuery ? FileCode2 : LayoutDashboard;
          const { item } = entry;

          return (
            <div
              key={`${entry.kind}-${item.id}`}
              className="flex w-[220px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    isQuery ? "bg-indigo-50 text-indigo-600" : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <StarButton
                  starred={item.starred}
                  onToggle={() =>
                    isQuery
                      ? onStarQuery(item.id, item.starred)
                      : onStarDashboard(item.id, item.starred)
                  }
                />
              </div>
              <Link href={href} className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900 hover:text-indigo-600">
                {item.name}
              </Link>
              <p className="mt-1 text-[11px] text-slate-400">{activity}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
