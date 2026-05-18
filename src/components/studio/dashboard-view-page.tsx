"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useVizCatalog } from "@/hooks/studio/use-viz-catalog";
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
  const [executed, setExecuted] = useState(false);

  const vizIds = useMemo(
    () =>
      dashboard?.items
        .filter((i) => i.panel_type === "visualization" && i.visualization_id)
        .map((i) => i.visualization_id!) ?? [],
    [dashboard],
  );

  const { data: vizCatalog } = useVizCatalog(vizIds);

  const defaultParams = useMemo(() => {
    const v: Record<string, string> = {};
    dashboard?.dashboard_params?.forEach((p: QueryParamDefinition) => {
      v[p.name] = p.default_value ?? "";
    });
    return v;
  }, [dashboard]);

  const runExecute = useCallback(
    async (paramValues: Record<string, string>) => {
      const res = await executeDashboard.mutateAsync({
        id: dashboardId,
        param_values: paramValues,
      });
      setExecuteResults(res.results);
      setExecuted(true);
    },
    [dashboardId, executeDashboard],
  );

  useEffect(() => {
    if (dashboard && !executed) {
      void runExecute(defaultParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard?.id]);

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
            className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit
          </Link>
          {canCreateStudioContent(user?.role) && (
            <button
              type="button"
              onClick={() => setForkOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
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
              className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
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
        layout={dashboard.layout ?? []}
        vizById={vizById}
        loading={executeDashboard.isPending}
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
