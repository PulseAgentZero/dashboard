"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitFork, Loader2, Pencil, Share2 } from "lucide-react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardFilterBar } from "@/components/studio/dashboard/dashboard-filter-bar";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardToolbar } from "@/components/studio/dashboard/dashboard-toolbar";
import { ForkDashboardModal } from "@/components/studio/modals/fork-dashboard-modal";
import { PublicBadge } from "@/components/studio/ui/public-badge";
import { StarButton } from "@/components/studio/ui/star-button";
import { useDashboardAutoRefresh } from "@/hooks/studio/use-dashboard-auto-refresh";
import {
  useExecuteDashboard,
  useForkDashboard,
  useStarDashboard,
  useStudioDashboard,
  useUpdateDashboard,
} from "@/hooks/studio/use-studio-dashboards";
import { useVisualizationsByIds } from "@/hooks/studio/use-viz-catalog";
import { mergeExecuteResults, resolveDashboardLayout } from "@/lib/studio/dashboard-layout";
import { canCreateStudioContent, canManageDashboardSettings } from "@/lib/studio/roles";
import { normalizeTimeRange, type DashboardTimeRange } from "@/lib/studio/time-range";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import type { DashboardExecuteResult, QueryParamDefinition } from "@/types/studio";

type Props = {
  dashboardId: string;
};

export function DashboardViewPage({ dashboardId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useStudioDashboard(dashboardId);
  const executeDashboard = useExecuteDashboard();
  const updateDashboard = useUpdateDashboard();
  const forkDashboard = useForkDashboard();
  const starDashboard = useStarDashboard();
  const canPersistSettings = canManageDashboardSettings(user?.role);

  const [forkOpen, setForkOpen] = useState(false);
  const [executeResults, setExecuteResults] = useState<DashboardExecuteResult[]>([]);
  const [pendingVizIds, setPendingVizIds] = useState<Set<string>>(() => new Set());
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>({ preset: "last_24h" });
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [autoApplyVars, setAutoApplyVars] = useState(true);

  const vizIds = useMemo(
    () =>
      dashboard?.items
        .filter((i) => i.panel_type === "visualization" && i.visualization_id)
        .map((i) => i.visualization_id!) ?? [],
    [dashboard?.items],
  );

  const { data: vizCatalog } = useVisualizationsByIds(vizIds);

  useEffect(() => {
    if (!dashboard) return;
    const defaults: Record<string, string> = {};
    dashboard.dashboard_params?.forEach((p: QueryParamDefinition) => {
      defaults[p.name] = p.default_value ?? "";
    });
    setParamValues(defaults);
    setTimeRange(normalizeTimeRange(dashboard.time_range));
    setRefreshIntervalSeconds(dashboard.refresh_interval_seconds ?? null);
  }, [dashboard?.id, dashboard?.updated_at]);

  const executeResultsRef = useRef(executeResults);
  executeResultsRef.current = executeResults;

  const runExecute = useCallback(
    async (values: Record<string, string>, range: DashboardTimeRange) => {
      if (vizIds.length === 0) return;

      setPendingVizIds((prev) => {
        const next = new Set(prev);
        for (const id of vizIds) {
          const existing = executeResultsRef.current.find((r) => r.visualization_id === id);
          if (!existing?.result && !existing?.error) {
            next.add(id);
          }
        }
        return next;
      });

      try {
        const res = await executeDashboard.mutateAsync({
          id: dashboardId,
          param_values: values,
          time_range: range,
        });
        setExecuteResults((prev) => mergeExecuteResults(prev, res.results));
        setLastRefreshedAt(new Date());
        const rateLimited = res.results.find((r) =>
          r.error?.toLowerCase().includes("execution budget"),
        );
        if (rateLimited?.error) {
          toast.error(rateLimited.error);
        }
      } finally {
        setPendingVizIds(new Set());
      }
    },
    [dashboardId, executeDashboard, vizIds],
  );

  const persistSettings = useCallback(
    (patch: { refresh_interval_seconds?: number | null; time_range?: DashboardTimeRange }) => {
      if (!canPersistSettings) return;
      updateDashboard.mutate({ id: dashboardId, body: patch });
    },
    [canPersistSettings, dashboardId, updateDashboard],
  );

  const handleTimeRangeChange = useCallback(
    (range: DashboardTimeRange) => {
      setTimeRange(range);
      persistSettings({ time_range: range });
      void runExecute(paramValues, range);
    },
    [paramValues, persistSettings, runExecute],
  );

  const handleRefreshIntervalChange = useCallback(
    (seconds: number | null) => {
      setRefreshIntervalSeconds(seconds);
      persistSettings({ refresh_interval_seconds: seconds });
    },
    [persistSettings],
  );

  const handleManualRefresh = useCallback(() => {
    void runExecute(paramValues, timeRange);
  }, [paramValues, runExecute, timeRange]);

  useDashboardAutoRefresh({
    intervalSeconds: refreshIntervalSeconds,
    onRefresh: handleManualRefresh,
    enabled: vizIds.length > 0,
  });

  const runExecuteRef = useRef(runExecute);
  runExecuteRef.current = runExecute;
  const paramValuesRef = useRef(paramValues);
  paramValuesRef.current = paramValues;
  const timeRangeRef = useRef(timeRange);
  timeRangeRef.current = timeRange;
  const autoExecutedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!dashboard?.id || vizIds.length === 0) return;
    const key = `${dashboard.id}:${vizIds.join(",")}`;
    if (autoExecutedKey.current === key) return;

    const t = setTimeout(() => {
      autoExecutedKey.current = key;
      void runExecuteRef.current(paramValuesRef.current, timeRangeRef.current);
    }, 500);
    return () => clearTimeout(t);
  }, [dashboard?.id, vizIds.join(",")]);

  const vizById = useMemo(() => {
    const map: Record<string, VizPanelData> = {};
    for (const vid of vizIds) {
      const meta = vizCatalog?.[vid];
      const er = executeResults.find((r) => r.visualization_id === vid);
      map[vid] = {
        visualizationId: vid,
        name: meta?.name ?? "Chart",
        chartType: meta?.chart_type ?? "table",
        config: meta?.config ?? {},
        columnFormats: meta?.column_formats,
        result: er?.result ?? null,
        error: er?.error ?? null,
      };
    }
    return map;
  }, [vizIds, vizCatalog, executeResults]);

  if (isLoading || !dashboard) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  const displayLayout = resolveDashboardLayout(dashboard.items, dashboard.layout);

  const shareUrl =
    dashboard.is_public && dashboard.slug && typeof window !== "undefined"
      ? `${window.location.origin}/p/${dashboard.slug}`
      : dashboard.is_public && dashboard.slug
        ? `/p/${dashboard.slug}`
        : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/studio" className="text-sm text-slate-500 hover:text-indigo-600">
            ← Studio
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">{dashboard.name}</h1>
          {dashboard.description && (
            <p className="mt-1 text-sm text-slate-500">{dashboard.description}</p>
          )}
          <div className="mt-2">
            <PublicBadge slug={dashboard.slug} isPublic={dashboard.is_public} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StarButton
            starred={dashboard.starred}
            onToggle={() => starDashboard.mutate({ id: dashboardId, starred: dashboard.starred })}
          />
          <Link
            href={`/dashboard/studio/dashboards/${dashboardId}/edit`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit
          </Link>
          {canCreateStudioContent(user?.role) && (
            <button
              type="button"
              onClick={() => setForkOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <GitFork size={14} />
              Fork
            </button>
          )}
          {shareUrl && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(shareUrl);
                toast.success("Public link copied");
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Share2 size={14} />
              Share
            </button>
          )}
        </div>
      </div>

      <DashboardToolbar
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        refreshIntervalSeconds={refreshIntervalSeconds}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        onManualRefresh={handleManualRefresh}
        lastRefreshedAt={lastRefreshedAt}
        loading={executeDashboard.isPending}
      />

      <DashboardFilterBar
        params={dashboard.dashboard_params ?? []}
        initialValues={paramValues}
        onApply={(v) => {
          setParamValues(v);
          void runExecute(v, timeRange);
        }}
        loading={executeDashboard.isPending}
        autoApplyOnChange={autoApplyVars}
      />

      {(dashboard.dashboard_params?.length ?? 0) > 0 && (
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={autoApplyVars}
            onChange={(e) => setAutoApplyVars(e.target.checked)}
            className="rounded border-slate-300"
          />
          Apply variables automatically on change
        </label>
      )}

      <p className="text-xs text-slate-500">
        Use <code className="rounded bg-slate-100 px-1">{`{{__time_from}}`}</code> and{" "}
        <code className="rounded bg-slate-100 px-1">{`{{__time_to}}`}</code> in SQL for time-range
        filters.
      </p>

      <DashboardGrid
        items={dashboard.items}
        layout={displayLayout}
        vizById={vizById}
        loadingVizIds={pendingVizIds}
      />

      <ForkDashboardModal
        open={forkOpen}
        defaultName={`${dashboard.name} (copy)`}
        onClose={() => setForkOpen(false)}
        onFork={async (name) => {
          const d = await forkDashboard.mutateAsync({ id: dashboardId, name });
          router.push(`/dashboard/studio/dashboards/${d.id}`);
        }}
      />
    </div>
  );
}
