"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitFork, Loader2, Pencil, Share2 } from "lucide-react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardFilterBar } from "@/components/studio/dashboard/dashboard-filter-bar";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { ForkDashboardModal } from "@/components/studio/modals/fork-dashboard-modal";
import { PublicBadge } from "@/components/studio/ui/public-badge";
import { StarButton } from "@/components/studio/ui/star-button";
import {
  useExecuteDashboard,
  useForkDashboard,
  useStarDashboard,
  useStudioDashboard,
} from "@/hooks/studio/use-studio-dashboards";
import { useVisualizationsByIds } from "@/hooks/studio/use-viz-catalog";
import { mergeExecuteResults, resolveDashboardLayout } from "@/lib/studio/dashboard-layout";
import { canCreateStudioContent } from "@/lib/studio/roles";
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
  const forkDashboard = useForkDashboard();
  const starDashboard = useStarDashboard();
  const [forkOpen, setForkOpen] = useState(false);
  const [executeResults, setExecuteResults] = useState<DashboardExecuteResult[]>([]);
  const [pendingVizIds, setPendingVizIds] = useState<Set<string>>(() => new Set());

  const vizIds = useMemo(
    () =>
      dashboard?.items
        .filter((i) => i.panel_type === "visualization" && i.visualization_id)
        .map((i) => i.visualization_id!) ?? [],
    [dashboard?.items],
  );

  const { data: vizCatalog } = useVisualizationsByIds(vizIds);

  const defaultParams = useMemo(() => {
    const v: Record<string, string> = {};
    dashboard?.dashboard_params?.forEach((p: QueryParamDefinition) => {
      v[p.name] = p.default_value ?? "";
    });
    return v;
  }, [dashboard?.dashboard_params]);

  const executeResultsRef = useRef(executeResults);
  executeResultsRef.current = executeResults;

  const runExecute = useCallback(
    async (paramValues: Record<string, string>) => {
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
          param_values: paramValues,
        });
        setExecuteResults((prev) => mergeExecuteResults(prev, res.results));
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

  const runExecuteRef = useRef(runExecute);
  runExecuteRef.current = runExecute;
  const defaultParamsRef = useRef(defaultParams);
  defaultParamsRef.current = defaultParams;
  const autoExecutedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!dashboard?.id || vizIds.length === 0) return;
    const key = `${dashboard.id}:${vizIds.join(",")}`;
    if (autoExecutedKey.current === key) return;

    const t = setTimeout(() => {
      autoExecutedKey.current = key;
      void runExecuteRef.current(defaultParamsRef.current);
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

      <DashboardFilterBar
        params={dashboard.dashboard_params ?? []}
        initialValues={defaultParams}
        onApply={(v) => void runExecute(v)}
        loading={executeDashboard.isPending}
      />

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
