"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Save, Settings } from "lucide-react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { EmbedCodeModal } from "@/components/studio/modals/embed-code-modal";
import { PublicBadge } from "@/components/studio/ui/public-badge";
import { TagEditor } from "@/components/studio/ui/tag-editor";
import {
  useAddDashboardItem,
  useCreateEmbedToken,
  useDeleteDashboardItem,
  useExecuteDashboard,
  useStudioDashboard,
  useUpdateDashboard,
} from "@/hooks/studio/use-studio-dashboards";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { useOrgVisualizations } from "@/hooks/studio/use-org-visualizations";
import { useVisualizationsByIds } from "@/hooks/studio/use-viz-catalog";
import {
  mergeDashboardLayout,
  mergeExecuteResults,
  resolveDashboardLayout,
} from "@/lib/studio/dashboard-layout";
import { canManageEmbed } from "@/lib/studio/roles";
import { useAuth } from "@/providers/auth-provider";
import type {
  DashboardExecuteResult,
  DashboardLayoutItem,
  QueryParamDefinition,
  StudioDashboardItem,
} from "@/types/studio";
import { toast } from "sonner";

type Props = {
  dashboardId: string;
};

export function DashboardBuilderPage({ dashboardId }: Props) {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useStudioDashboard(dashboardId);
  const updateDashboard = useUpdateDashboard();
  const addItem = useAddDashboardItem();
  const deleteItem = useDeleteDashboardItem();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();
  const createEmbed = useCreateEmbedToken();
  const executeDashboard = useExecuteDashboard();
  const { data: orgVizData } = useOrgVisualizations({ limit: 200 });

  const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedData, setEmbedData] = useState<{ token: string; embed_url: string; expires_at: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [dashboardParams, setDashboardParams] = useState<QueryParamDefinition[]>([]);
  const [textContent, setTextContent] = useState("## Section\n\nAdd notes here.");
  const [pickerOpen, setPickerOpen] = useState(false);
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

  const defaultParamValues = useMemo(() => {
    const v: Record<string, string> = {};
    dashboardParams.forEach((p) => {
      v[p.name] = p.default_value ?? "";
    });
    return v;
  }, [dashboardParams]);

  const executeResultsRef = useRef(executeResults);
  executeResultsRef.current = executeResults;

  const runExecute = useCallback(
    async (
      paramValues: Record<string, string>,
      opts?: { loadingVizIds?: string[] },
    ) => {
      const ids = opts?.loadingVizIds ?? vizIds;
      if (ids.length === 0) return;

      setPendingVizIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
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
        setPendingVizIds((prev) => {
          const next = new Set(prev);
          for (const id of ids) next.delete(id);
          return next;
        });
      }
    },
    [dashboardId, executeDashboard, vizIds],
  );

  const runExecuteRef = useRef(runExecute);
  runExecuteRef.current = runExecute;
  const defaultParamValuesRef = useRef(defaultParamValues);
  defaultParamValuesRef.current = defaultParamValues;
  const autoExecutedKey = useRef<string | null>(null);

  const itemsKey = useMemo(
    () => dashboard?.items.map((i) => `${i.id}:${i.position}`).join("|") ?? "",
    [dashboard?.items],
  );
  const layoutKey = useMemo(() => JSON.stringify(dashboard?.layout ?? []), [dashboard?.layout]);

  useEffect(() => {
    if (!dashboard) return;
    setLayout((prev) => mergeDashboardLayout(dashboard.items, dashboard.layout, prev));
    setName(dashboard.name);
    setDescription(dashboard.description ?? "");
    setTags(dashboard.tags ?? []);
    setIsPublic(dashboard.is_public);
    setDashboardParams(dashboard.dashboard_params ?? []);
  }, [dashboard, itemsKey, layoutKey]);

  useEffect(() => {
    if (!dashboard?.id || vizIds.length === 0) return;
    const key = `${dashboard.id}:${vizIds.join(",")}`;
    if (autoExecutedKey.current === key) return;

    const t = setTimeout(() => {
      autoExecutedKey.current = key;
      void runExecuteRef.current(defaultParamValuesRef.current);
    }, 500);
    return () => clearTimeout(t);
  }, [dashboard?.id, vizIds.join(",")]);

  const allViz = orgVizData?.visualizations ?? [];

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

  async function saveLayout() {
    await updateDashboard.mutateAsync({
      id: dashboardId,
      body: { layout },
    });
  }

  async function saveSettings() {
    await updateDashboard.mutateAsync({
      id: dashboardId,
      body: {
        name,
        description: description || null,
        tags,
        is_public: isPublic,
        dashboard_params: dashboardParams,
      },
    });
    setSettingsOpen(false);
  }

  async function addVisualization(vizId: string) {
    await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "visualization", visualization_id: vizId, position: dashboard?.items.length ?? 0 },
    });
    setPickerOpen(false);
  }

  async function addTextPanel() {
    await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "text", content: textContent, position: dashboard?.items.length ?? 0 },
    });
  }

  function requestRemovePanel(item: StudioDashboardItem) {
    const panelName =
      item.panel_type === "text"
        ? (item.content ?? "")
            .split("\n")
            .map((line) => line.trim())
            .find((line) => line.startsWith("#"))
            ?.replace(/^#+\s*/, "")
            .trim() || "Text panel"
        : vizById[item.visualization_id ?? ""]?.name ?? "Chart";

    requestDeleteConfirm({
      title: "Remove panel",
      description: `Remove "${panelName}" from this dashboard? The saved chart or query is not deleted.`,
      confirmLabel: "Remove",
      onConfirm: async () => {
        await deleteItem.mutateAsync({ dashboardId, itemId: item.id });
        setLayout((prev) => prev.filter((slot) => slot.item_id !== item.id));
        if (item.visualization_id) {
          setExecuteResults((prev) =>
            prev.filter((r) => r.visualization_id !== item.visualization_id),
          );
          setPendingVizIds((prev) => {
            const next = new Set(prev);
            if (item.visualization_id) next.delete(item.visualization_id);
            return next;
          });
        }
      },
    });
  }

  const displayLayout = useMemo(
    () => (dashboard ? resolveDashboardLayout(dashboard.items, layout) : []),
    [dashboard, layout],
  );

  if (isLoading || !dashboard) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/dashboard/studio/dashboards/${dashboardId}`} className="text-sm text-slate-500">
            ← View
          </Link>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block text-xl font-semibold text-slate-900 border-0 border-b border-transparent focus:border-indigo-300 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Plus size={14} />
            Add chart
          </button>
          <button
            type="button"
            onClick={() => void addTextPanel()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Text panel
          </button>
          <button
            type="button"
            onClick={() => void saveLayout()}
            disabled={updateDashboard.isPending}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Save size={14} />
            Save layout
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {pickerOpen && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Pick visualization</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allViz.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => void addVisualization(v.id)}
                className="rounded-lg border px-3 py-2 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50"
              >
                {v.name}
                <span className="ml-1 text-xs text-slate-400">({v.chart_type})</span>
              </button>
            ))}
            {allViz.length === 0 && (
              <p className="text-sm text-slate-400">Create charts from saved queries first.</p>
            )}
          </div>
        </div>
      )}

      <DashboardGrid
        items={dashboard.items}
        layout={displayLayout}
        vizById={vizById}
        editable
        loadingVizIds={pendingVizIds}
        onLayoutChange={setLayout}
        onRemoveItem={requestRemovePanel}
      />

      {deleteConfirmModal}

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Dashboard settings</h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </label>
              <div>
                <span className="text-sm font-medium">Tags</span>
                <TagEditor tags={tags} onChange={setTags} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                Public dashboard
              </label>
              {isPublic && <PublicBadge slug={dashboard.slug} isPublic />}
              <div>
                <span className="text-sm font-medium">Filters</span>
                {dashboardParams.map((p, i) => (
                  <div key={i} className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      value={p.name}
                      onChange={(e) => {
                        const next = [...dashboardParams];
                        next[i] = { ...p, name: e.target.value };
                        setDashboardParams(next);
                      }}
                      placeholder="name"
                      className="rounded border px-2 py-1 text-sm font-mono"
                    />
                    <select
                      value={p.type}
                      onChange={(e) => {
                        const next = [...dashboardParams];
                        next[i] = { ...p, type: e.target.value as QueryParamDefinition["type"] };
                        setDashboardParams(next);
                      }}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      <option value="text">text</option>
                      <option value="number">number</option>
                      <option value="date">date</option>
                      <option value="datetime">datetime</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDashboardParams([
                      ...dashboardParams,
                      { name: "filter", type: "text", default_value: "", label: "Filter" },
                    ])
                  }
                  className="mt-2 text-sm text-indigo-600"
                >
                  + Add filter
                </button>
              </div>
              {canManageEmbed(user?.role) && (
                <button
                  type="button"
                  onClick={async () => {
                    const res = await createEmbed.mutateAsync({ id: dashboardId });
                    setEmbedData(res);
                    setEmbedOpen(true);
                  }}
                  className="text-sm text-indigo-600"
                >
                  Generate embed code
                </button>
              )}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void saveSettings()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EmbedCodeModal
        open={embedOpen}
        embedUrl={embedData?.embed_url ?? ""}
        token={embedData?.token ?? ""}
        expiresAt={embedData?.expires_at ?? ""}
        onClose={() => setEmbedOpen(false)}
      />
    </div>
  );
}
