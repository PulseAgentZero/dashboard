"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/shared/pagination";
import { STUDIO_LIST_PAGE_SIZE } from "@/lib/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCode2,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { CreateDashboardModal } from "@/components/studio/modals/create-dashboard-modal";
import {
  DashboardListRow,
  QueryListRow,
  StudioListEmpty,
  StudioListSkeleton,
} from "@/components/studio/studio-resource-list";
import {
  useCreateDashboard,
  useStarDashboard,
  useStudioDashboards,
} from "@/hooks/studio/use-studio-dashboards";
import { useRunQuery, useStarQuery, useStudioQueries } from "@/hooks/studio/use-studio-queries";
import { useAuth } from "@/providers/auth-provider";
import { useUsage } from "@/hooks/usage/use-usage";
import { canCreateStudioContent } from "@/lib/studio/roles";

export function StudioHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const canCreate = canCreateStudioContent(user?.role);

  const [tab, setTab] = useState<"queries" | "dashboards">("queries");
  const [q, setQ] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [createDashOpen, setCreateDashOpen] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [queriesPage, setQueriesPage] = useState(1);
  const [dashboardsPage, setDashboardsPage] = useState(1);

  const listFilters = useMemo(
    () => ({ q: q || undefined, starred: starredOnly || undefined, tags: tagFilter ?? undefined }),
    [q, starredOnly, tagFilter],
  );

  useEffect(() => {
    setQueriesPage(1);
    setDashboardsPage(1);
  }, [listFilters]);

  const queriesParams = useMemo(
    () => ({ ...listFilters, page: queriesPage, limit: STUDIO_LIST_PAGE_SIZE }),
    [listFilters, queriesPage],
  );
  const dashboardsParams = useMemo(
    () => ({ ...listFilters, page: dashboardsPage, limit: STUDIO_LIST_PAGE_SIZE }),
    [listFilters, dashboardsPage],
  );

  const { data: queriesData, isLoading: queriesLoading } = useStudioQueries(queriesParams);
  const { data: dashboardsData, isLoading: dashboardsLoading } = useStudioDashboards(dashboardsParams);
  const createDashboard = useCreateDashboard();
  const starQuery = useStarQuery();
  const starDashboard = useStarDashboard();
  const runQuery = useRunQuery();
  const { data: usage } = useUsage();
  const studioExec = usage?.limits?.studio_executions_today;
  const studioDash = usage?.limits?.studio_dashboards;

  const queries = queriesData?.queries ?? [];
  const dashboards = dashboardsData?.dashboards ?? [];
  const isLoading = tab === "queries" ? queriesLoading : dashboardsLoading;
  const items = tab === "queries" ? queries : dashboards;
  const listTotal = tab === "queries" ? (queriesData?.total ?? 0) : (dashboardsData?.total ?? 0);
  const listPage = tab === "queries" ? queriesPage : dashboardsPage;

  const allTags = useMemo(() => {
    const source = tab === "queries" ? queries : dashboards;
    const tags = new Set<string>();
    source.forEach((i) => i.tags?.forEach((t: string) => tags.add(t)));
    return [...tags].sort();
  }, [tab, queries, dashboards]);

  async function handleCreateDashboard(name: string, description: string) {
    const d = await createDashboard.mutateAsync({ name, description: description || null });
    router.push(`/dashboard/studio/dashboards/${d.id}/edit`);
  }

  function handleRunQuery(id: string) {
    setRunningId(id);
    runQuery.mutate(
      { id },
      { onSettled: () => setRunningId(null) },
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Pulse Studio</h1>
          </div>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            SQL analytics, saved queries, charts, and custom dashboards on your connected data.
          </p>
        </div>
        {canCreate && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/studio/queries/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} />
              New query
            </Link>
            <button
              type="button"
              onClick={() => setCreateDashOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <LayoutDashboard size={16} />
              New dashboard
            </button>
          </div>
        )}
      </div>

      {(studioExec || studioDash) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {studioExec && (
            <UsageStat
              label="Query runs today"
              used={studioExec.used}
              limit={studioExec.limit}
            />
          )}
          {studioDash && (
            <UsageStat
              label="Dashboards"
              used={studioDash.used}
              limit={studioDash.limit}
            />
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${tab}…`}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Starred only
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(["queries", "dashboards"] as const).map((t) => {
              const count = t === "queries" ? queries.length : dashboards.length;
              const Icon = t === "queries" ? FileCode2 : LayoutDashboard;
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setTagFilter(null);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <Icon size={15} className={active ? "text-indigo-600" : "text-slate-400"} />
                  <span className="capitalize">{t}</span>
                  {!queriesLoading && !dashboardsLoading && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                        active ? "bg-indigo-100 text-indigo-700" : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {allTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setTagFilter(null)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  !tagFilter
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                All tags
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTagFilter(t)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    tagFilter === t
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isLoading && items.length > 0 && (
          <div className="hidden border-b border-slate-100 bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[1fr_140px_88px] md:gap-4">
            <span>Name</span>
            <span className="text-right">Activity</span>
            <span className="text-right">Actions</span>
          </div>
        )}

        {isLoading ? (
          <StudioListSkeleton />
        ) : items.length === 0 ? (
          <StudioListEmpty
            kind={tab}
            canCreate={canCreate}
            onCreateDashboard={() => setCreateDashOpen(true)}
          />
        ) : tab === "queries" ? (
          <div>
            {queries.map((query) => (
              <QueryListRow
                key={query.id}
                query={query}
                onStar={() => starQuery.mutate({ id: query.id, starred: query.starred })}
                onRun={() => handleRunQuery(query.id)}
                running={runningId === query.id && runQuery.isPending}
              />
            ))}
          </div>
        ) : (
          <div>
            {dashboards.map((dash) => (
              <DashboardListRow
                key={dash.id}
                dashboard={dash}
                onStar={() => starDashboard.mutate({ id: dash.id, starred: dash.starred })}
              />
            ))}
          </div>
        )}

        <Pagination
          page={listPage}
          pageSize={STUDIO_LIST_PAGE_SIZE}
          total={listTotal}
          onPageChange={tab === "queries" ? setQueriesPage : setDashboardsPage}
        />
      </div>

      <CreateDashboardModal
        open={createDashOpen}
        onClose={() => setCreateDashOpen(false)}
        onCreate={handleCreateDashboard}
      />
    </div>
  );
}

function UsageStat({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const pct = limit != null && limit > 0 ? Math.min(100, (used / limit) * 100) : null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
        {used}
        {limit != null ? (
          <span className="text-sm font-medium text-slate-400"> / {limit}</span>
        ) : (
          <span className="text-sm font-medium text-slate-400"> · unlimited</span>
        )}
      </p>
      {pct != null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
