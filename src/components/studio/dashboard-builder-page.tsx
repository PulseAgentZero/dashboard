"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Save, Settings, Eye, FileText, ChevronLeft, X } from "lucide-react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardFilterBar } from "@/components/studio/dashboard/dashboard-filter-bar";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardToolbar } from "@/components/studio/dashboard/dashboard-toolbar";
import { useDashboardAutoRefresh } from "@/hooks/studio/use-dashboard-auto-refresh";
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
import { normalizeTimeRange, type DashboardTimeRange } from "@/lib/studio/time-range";
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
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>({ preset: "last_24h" });
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

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

  const timeRangeRef = useRef(timeRange);
  timeRangeRef.current = timeRange;

  const runExecute = useCallback(
    async (
      values: Record<string, string>,
      range: DashboardTimeRange,
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
    setParamValues(
      Object.fromEntries(
        (dashboard.dashboard_params ?? []).map((p) => [p.name, p.default_value ?? ""]),
      ),
    );
    setTimeRange(normalizeTimeRange(dashboard.time_range));
    setRefreshIntervalSeconds(dashboard.refresh_interval_seconds ?? null);
  }, [dashboard, itemsKey, layoutKey]);

  useEffect(() => {
    if (!dashboard?.id || vizIds.length === 0) return;
    const key = `${dashboard.id}:${vizIds.join(",")}`;
    if (autoExecutedKey.current === key) return;

    const t = setTimeout(() => {
      autoExecutedKey.current = key;
      void runExecuteRef.current(
        defaultParamValuesRef.current,
        timeRangeRef.current,
      );
    }, 500);
    return () => clearTimeout(t);
  }, [dashboard?.id, vizIds.join(",")]);

  const handleManualRefresh = useCallback(() => {
    void runExecute(paramValues, timeRange);
  }, [paramValues, runExecute, timeRange]);

  useDashboardAutoRefresh({
    intervalSeconds: refreshIntervalSeconds,
    onRefresh: handleManualRefresh,
    enabled: vizIds.length > 0,
  });

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
    toast.success("Layout saved successfully");
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
        refresh_interval_seconds: refreshIntervalSeconds,
        time_range: timeRange,
      },
    });
    setSettingsOpen(false);
    toast.success("Settings updated");
  }

  async function addVisualization(vizId: string) {
    await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "visualization", visualization_id: vizId, position: dashboard?.items.length ?? 0 },
    });
    setPickerOpen(false);
    toast.success("Chart added to canvas");
  }

  async function addTextPanel() {
    await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "text", content: textContent, position: dashboard?.items.length ?? 0 },
    });
    toast.success("Text block added");
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
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
      {/* Top Header/Action Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <Link 
            href={`/dashboard/studio/dashboards/${dashboardId}`} 
            className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-orange-600"
          >
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to View Mode
          </Link>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border-b border-transparent bg-transparent py-0.5 text-2xl font-bold tracking-tight text-slate-900 transition-colors hover:border-slate-200 focus:border-orange-500 focus:outline-none"
            placeholder="Untitled Dashboard"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all shadow-sm ${
              pickerOpen 
                ? "border-orange-200 bg-orange-50 text-orange-700" 
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Plus size={16} />
            Add chart
          </button>
          
          <button
            type="button"
            onClick={() => void addTextPanel()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <FileText size={16} />
            Text panel
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={16} />
            Settings
          </button>

          <button
            type="button"
            onClick={() => void saveLayout()}
            disabled={updateDashboard.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={16} />
            Save layout
          </button>
        </div>
      </div>

      {/* Modern Catalog Panel Selection */}
      {pickerOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Available Visualizations</p>
            <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allViz.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => void addVisualization(v.id)}
                className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-orange-400 hover:ring-2 hover:ring-orange-100"
              >
                <p className="text-sm font-medium text-slate-800 transition-colors group-hover:text-orange-700">{v.name}</p>
                <span className="inline-block mt-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {v.chart_type}
                </span>
              </button>
            ))}
            {allViz.length === 0 && (
              <p className="text-sm text-slate-400 py-2 col-span-full">Create charts from saved queries first.</p>
            )}
          </div>
        </div>
      )}

      {/* Control Toolbars */}
      <div className="space-y-3 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <DashboardToolbar
          timeRange={timeRange}
          onTimeRangeChange={(range) => {
            setTimeRange(range);
            void runExecute(paramValues, range);
          }}
          refreshIntervalSeconds={refreshIntervalSeconds}
          onRefreshIntervalChange={setRefreshIntervalSeconds}
          onManualRefresh={handleManualRefresh}
          lastRefreshedAt={lastRefreshedAt}
          loading={executeDashboard.isPending}
        />

        <DashboardFilterBar
          params={dashboardParams}
          initialValues={paramValues}
          onApply={(v) => {
            setParamValues(v);
            void runExecute(v, timeRange);
          }}
          loading={executeDashboard.isPending}
          autoApplyOnChange
        />
      </div>

      {/* Main Canvas Area */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-2 min-h-[400px]">
        <DashboardGrid
          items={dashboard.items}
          layout={displayLayout}
          vizById={vizById}
          editable
          loadingVizIds={pendingVizIds}
          onLayoutChange={setLayout}
          onRemoveItem={requestRemovePanel}
        />
      </div>

      {deleteConfirmModal}

      {/* Slide-over Settings Sheet Drawer */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">Dashboard configuration</h2>
                <button 
                  onClick={() => setSettingsOpen(false)} 
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide details about the metrics in this configuration dashboard..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium text-slate-700 mb-1">Tags</span>
                  <TagEditor tags={tags} onChange={setTags} />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      checked={isPublic} 
                      onChange={(e) => setIsPublic(e.target.checked)} 
                      className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-slate-800">Public dashboard</p>
                      <p className="text-xs text-slate-400">Make this canvas discoverable by link</p>
                    </div>
                  </label>
                </div>

                {isPublic && (
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <PublicBadge slug={dashboard.slug} isPublic />
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Declared Filters</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDashboardParams([
                          ...dashboardParams,
                          { name: "filter", type: "text", default_value: "", label: "Filter" },
                        ])
                      }
                      className="text-xs font-semibold text-orange-600 hover:text-orange-500"
                    >
                      + Add parameter
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {dashboardParams.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50/50 p-2 border border-slate-100">
                        <input
                          value={p.name}
                          onChange={(e) => {
                            const next = [...dashboardParams];
                            next[i] = { ...p, name: e.target.value };
                            setDashboardParams(next);
                          }}
                          placeholder="name"
                          className="w-1/2 rounded border border-slate-200 bg-white px-2 py-1 text-sm font-mono focus:border-orange-500 focus:outline-none"
                        />
                        <select
                          value={p.type}
                          onChange={(e) => {
                            const next = [...dashboardParams];
                            next[i] = { ...p, type: e.target.value as QueryParamDefinition["type"] };
                            setDashboardParams(next);
                          }}
                          className="w-1/2 rounded border border-slate-200 bg-white px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                        >
                          <option value="text">text</option>
                          <option value="number">number</option>
                          <option value="date">date</option>
                          <option value="datetime">datetime</option>
                        </select>
                        <button 
                          onClick={() => setDashboardParams(dashboardParams.filter((_, idx) => idx !== i))}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {canManageEmbed(user?.role) && (
                  <div className="border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await createEmbed.mutateAsync({ id: dashboardId });
                        setEmbedData(res);
                        setEmbedOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-500"
                    >
                      <Eye size={15} />
                      Generate public embed credentials
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveSettings()}
                className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
              >
                Apply changes
              </button>
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