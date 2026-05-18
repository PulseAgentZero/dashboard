"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Loader2, Play, Plus, Search } from "lucide-react";
import { CreateDashboardModal } from "@/components/studio/modals/create-dashboard-modal";
import { StarButton } from "@/components/studio/ui/star-button";
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

  const listParams = useMemo(
    () => ({ q: q || undefined, starred: starredOnly || undefined, tags: tagFilter ?? undefined }),
    [q, starredOnly, tagFilter],
  );

  const { data: queriesData, isLoading: queriesLoading } = useStudioQueries(listParams);
  const { data: dashboardsData, isLoading: dashboardsLoading } = useStudioDashboards(listParams);
  const createDashboard = useCreateDashboard();
  const starQuery = useStarQuery();
  const starDashboard = useStarDashboard();
  const runQuery = useRunQuery();
  const { data: usage } = useUsage();
  const studioExec = usage?.limits?.studio_executions_today;
  const studioDash = usage?.limits?.studio_dashboards;

  const allTags = useMemo(() => {
    const items = tab === "queries" ? queriesData?.queries : dashboardsData?.dashboards;
    const tags = new Set<string>();
    items?.forEach((i) => i.tags?.forEach((t: string) => tags.add(t)));
    return [...tags];
  }, [tab, queriesData, dashboardsData]);

  async function handleCreateDashboard(name: string, description: string) {
    const d = await createDashboard.mutateAsync({ name, description: description || null });
    router.push(`/dashboard/studio/dashboards/${d.id}/edit`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pulse Studio</h1>
          <p className="mt-0.5 text-sm text-slate-500">SQL analytics, charts, and custom dashboards</p>
        </div>
        {canCreate && (
          <div className="flex gap-2">
            <Link
              href="/dashboard/studio/queries/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              New query
            </Link>
            <button
              type="button"
              onClick={() => setCreateDashOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LayoutDashboard size={16} />
              New dashboard
            </button>
          </div>
        )}
      </div>

      {(studioExec || studioDash) && (
        <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          {studioExec && (
            <span>
              Query runs today: {studioExec.used}
              {studioExec.limit != null ? ` / ${studioExec.limit}` : " (unlimited)"}
            </span>
          )}
          {studioDash && (
            <span>
              Dashboards: {studioDash.used}
              {studioDash.limit != null ? ` / ${studioDash.limit}` : " (unlimited)"}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={starredOnly}
            onChange={(e) => setStarredOnly(e.target.checked)}
          />
          Starred only
        </label>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {(["queries", "dashboards"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTagFilter(null)}
            className={`rounded-full px-2.5 py-1 text-xs ${!tagFilter ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTagFilter(t)}
              className={`rounded-full px-2.5 py-1 text-xs ${tagFilter === t ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {(tab === "queries" ? queriesLoading : dashboardsLoading) ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-500" size={28} />
        </div>
      ) : tab === "queries" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {queriesData?.queries.map((query) => (
            <div
              key={query.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/dashboard/studio/queries/${query.id}`}
                  className="font-semibold text-slate-900 hover:text-indigo-600"
                >
                  {query.name}
                </Link>
                <StarButton
                  starred={query.starred}
                  onToggle={() => starQuery.mutate({ id: query.id, starred: query.starred })}
                />
              </div>
              {query.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{query.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {query.tags?.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {query.last_run_at
                    ? `Last run ${new Date(query.last_run_at).toLocaleDateString()}`
                    : "Never run"}
                </span>
                <button
                  type="button"
                  onClick={() => runQuery.mutate({ id: query.id })}
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Play size={12} />
                  Run
                </button>
              </div>
            </div>
          ))}
          {!queriesData?.queries.length && (
            <p className="col-span-full py-8 text-center text-sm text-slate-400">No queries yet</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardsData?.dashboards.map((dash) => (
            <div
              key={dash.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/dashboard/studio/dashboards/${dash.id}`}
                  className="font-semibold text-slate-900 hover:text-indigo-600"
                >
                  {dash.name}
                </Link>
                <StarButton
                  starred={dash.starred}
                  onToggle={() => starDashboard.mutate({ id: dash.id, starred: dash.starred })}
                />
              </div>
              {dash.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{dash.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Updated {new Date(dash.updated_at).toLocaleDateString()}</span>
                {dash.is_public && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Public</span>
                )}
              </div>
            </div>
          ))}
          {!dashboardsData?.dashboards.length && (
            <p className="col-span-full py-8 text-center text-sm text-slate-400">No dashboards yet</p>
          )}
        </div>
      )}

      <CreateDashboardModal
        open={createDashOpen}
        onClose={() => setCreateDashOpen(false)}
        onCreate={handleCreateDashboard}
      />
    </div>
  );
}
