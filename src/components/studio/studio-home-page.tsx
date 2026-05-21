"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Pagination } from "@/components/shared/pagination";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";
import { STUDIO_LIST_PAGE_SIZE } from "@/lib/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Plus, Search } from "lucide-react";
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
import { useStudioTags } from "@/hooks/studio/use-studio-tags";
import { useAuth } from "@/providers/auth-provider";
import { canCreateStudioContent } from "@/lib/studio/roles";

export function StudioHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  // Viewers can compose and run ad-hoc SQL in Studio, but can't persist queries.
  // Creating saved queries/dashboards still requires analyst+ on the backend.
  const canComposeQuery = Boolean(user?.role);
  const canCreate = canCreateStudioContent(user?.role);
  const [, startTransition] = useTransition();

  const [tab, setTab] = useState<"queries" | "dashboards">("queries");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [createDashOpen, setCreateDashOpen] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const listFilters = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      starred: starredOnly || undefined,
      tags: tagFilter || undefined,
    }),
    [debouncedSearch, starredOnly, tagFilter],
  );

  useEffect(() => {
    setPage(1);
  }, [listFilters, tab]);

  const listParams = useMemo(
    () => ({ ...listFilters, page, limit: STUDIO_LIST_PAGE_SIZE }),
    [listFilters, page],
  );

  const isQueries = tab === "queries";

  const { data: queriesCountData } = useStudioQueries({ limit: 1 });
  const { data: dashboardsCountData } = useStudioDashboards({ limit: 1 });

  const { data: queriesData, isLoading: queriesLoading } = useStudioQueries(
    isQueries ? listParams : { limit: 1 },
  );
  const { data: dashboardsData, isLoading: dashboardsLoading } = useStudioDashboards(
    !isQueries ? listParams : { limit: 1 },
  );

  const { data: allTags = [] } = useStudioTags();

  const createDashboard = useCreateDashboard();
  const starQuery = useStarQuery();
  const starDashboard = useStarDashboard();
  const runQuery = useRunQuery();

  const loading = isQueries ? queriesLoading : dashboardsLoading;
  const queries = queriesData?.queries ?? [];
  const dashboards = dashboardsData?.dashboards ?? [];
  const total = isQueries ? (queriesData?.total ?? 0) : (dashboardsData?.total ?? 0);
  const queriesTotal = queriesCountData?.total ?? 0;
  const dashboardsTotal = dashboardsCountData?.total ?? 0;

  function handleSearchChange(value: string) {
    setSearch(value);
    startTransition(() => setDebouncedSearch(value));
  }

  async function handleCreateDashboard(name: string, description: string) {
    const d = await createDashboard.mutateAsync({ name, description: description || null });
    router.push(`/dashboard/studio/dashboards/${d.id}/edit`);
  }

  function handleRunQuery(id: string) {
    setRunningId(id);
    runQuery.mutate({ id }, { onSettled: () => setRunningId(null) });
  }

  return (
    <DashboardPageShell className="space-y-4">
      {/* Top Banner Header Block */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Studio</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Queries and dashboards on your data.</p>
        </div>
        {(canComposeQuery || canCreate) && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {canComposeQuery && (
              <Link
                href="/dashboard/studio/queries/new"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors shadow-xs"
              >
                <Plus size={14} />
                New query
              </Link>
            )}
            {canCreate && (
              <button
                type="button"
                onClick={() => setCreateDashOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Container Card */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Interactive Filters Grid Area */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
          {/* Main Content Category Tabs */}
          <div className="flex gap-0.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {(["queries", "dashboards"] as const).map((t) => {
              const count = t === "queries" ? queriesTotal : dashboardsTotal;
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                  <span className="ml-1.5 tabular-nums text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Starred, & Tags Filters Lineup */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative w-full sm:w-48 md:w-56">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4 sm:gap-3">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={starredOnly}
                  onChange={(e) => setStarredOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-400/40 h-3.5 w-3.5"
                />
                Starred
              </label>

              {allTags.length > 0 && (
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="rounded-md border border-slate-200 bg-white py-1.5 pl-2 pr-7 text-xs text-slate-700 outline-none focus:border-orange-400 transition-colors"
                >
                  <option value="">All tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Resource Rows Content Panel */}
        {loading ? (
          <div className="p-4">
            <StudioListSkeleton rows={6} compact />
          </div>
        ) : (isQueries ? queries.length === 0 : dashboards.length === 0) ? (
          <StudioListEmpty
            kind={tab}
            canCreate={isQueries ? canComposeQuery : canCreate}
            onCreateDashboard={() => setCreateDashOpen(true)}
          />
        ) : isQueries ? (
          <div className="divide-y divide-slate-50">
            {queries.map((query) => (
              <QueryListRow
                key={query.id}
                query={query}
                compact
                onStar={() => starQuery.mutate({ id: query.id, starred: query.starred })}
                onRun={() => handleRunQuery(query.id)}
                running={runningId === query.id && runQuery.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {dashboards.map((dashboard) => (
              <DashboardListRow
                key={dashboard.id}
                dashboard={dashboard}
                compact
                onStar={() => starDashboard.mutate({ id: dashboard.id, starred: dashboard.starred })}
              />
            ))}
          </div>
        )}

        {!loading && total > 0 && (
          <div className="border-t border-slate-100 p-4">
            <Pagination
              page={page}
              pageSize={STUDIO_LIST_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <CreateDashboardModal
        open={createDashOpen}
        onClose={() => setCreateDashOpen(false)}
        onCreate={handleCreateDashboard}
      />
    </DashboardPageShell>
  );
}