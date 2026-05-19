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
    <DashboardPageShell className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Studio</h1>
          <p className="mt-0.5 text-sm text-slate-500">Queries and dashboards on your data.</p>
        </div>
        {canCreate && (
          <div className="flex shrink-0 gap-2">
            <Link
              href="/dashboard/studio/queries/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={15} />
              New query
            </Link>
            <button
              type="button"
              onClick={() => setCreateDashOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </button>
          </div>
        )}
      </header>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {(["queries", "dashboards"] as const).map((t) => {
              const count = t === "queries" ? queriesTotal : dashboardsTotal;
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                  <span className="ml-1.5 tabular-nums text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600"
              />
              Starred
            </label>
            {allTags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="rounded-md border border-slate-200 py-1.5 pl-2 pr-7 text-sm text-slate-700 outline-none focus:border-indigo-400"
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

        {loading ? (
          <StudioListSkeleton rows={6} compact />
        ) : (isQueries ? queries.length === 0 : dashboards.length === 0) ? (
          <StudioListEmpty
            kind={tab}
            canCreate={canCreate}
            onCreateDashboard={() => setCreateDashOpen(true)}
          />
        ) : isQueries ? (
          <div>
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
          <div>
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
          <Pagination
            page={page}
            pageSize={STUDIO_LIST_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
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
