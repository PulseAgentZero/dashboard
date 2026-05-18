"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Settings, Trash2 } from "lucide-react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { EmbedCodeModal } from "@/components/studio/modals/embed-code-modal";
import { PublicBadge } from "@/components/studio/ui/public-badge";
import { TagEditor } from "@/components/studio/ui/tag-editor";
import {
  useAddDashboardItem,
  useCreateEmbedToken,
  useStudioDashboard,
  useUpdateDashboard,
} from "@/hooks/studio/use-studio-dashboards";
import { useQueryClient } from "@tanstack/react-query";
import { useStudioQueries } from "@/hooks/studio/use-studio-queries";
import { useVizCatalog } from "@/hooks/studio/use-viz-catalog";
import { studioApi } from "@/lib/api/studio-api";
import { canManageEmbed } from "@/lib/studio/roles";
import { useAuth } from "@/providers/auth-provider";
import type { DashboardLayoutItem, QueryParamDefinition, StudioVisualization } from "@/types/studio";

type Props = {
  dashboardId: string;
};

export function DashboardBuilderPage({ dashboardId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: dashboard, isLoading } = useStudioDashboard(dashboardId);
  const updateDashboard = useUpdateDashboard();
  const addItem = useAddDashboardItem();
  const createEmbed = useCreateEmbedToken();
  const { data: queriesData } = useStudioQueries({ limit: 100 });

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
  const [allViz, setAllViz] = useState<StudioVisualization[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const vizIds = useMemo(
    () =>
      dashboard?.items
        .filter((i) => i.panel_type === "visualization" && i.visualization_id)
        .map((i) => i.visualization_id!) ?? [],
    [dashboard],
  );
  const { data: vizCatalog } = useVizCatalog(vizIds);

  useEffect(() => {
    if (!dashboard) return;
    setLayout(dashboard.layout ?? []);
    setName(dashboard.name);
    setDescription(dashboard.description ?? "");
    setTags(dashboard.tags ?? []);
    setIsPublic(dashboard.is_public);
    setDashboardParams(dashboard.dashboard_params ?? []);
  }, [dashboard]);

  useEffect(() => {
    async function loadViz() {
      if (!queriesData?.queries) return;
      const list: StudioVisualization[] = [];
      for (const q of queriesData.queries) {
        const { visualizations } = await studioApi.listVisualizations(q.id);
        list.push(...visualizations);
      }
      setAllViz(list);
    }
    void loadViz();
  }, [queriesData]);

  const vizById = useMemo(() => {
    const map: Record<string, VizPanelData> = {};
    for (const vid of vizIds) {
      const meta = vizCatalog?.[vid];
      map[vid] = {
        visualizationId: vid,
        name: meta?.name ?? "Chart",
        chartType: meta?.chart_type ?? "table",
        config: meta?.config ?? {},
        columnFormats: meta?.column_formats,
        result: null,
      };
    }
    return map;
  }, [vizIds, vizCatalog]);

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
    const item = await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "visualization", visualization_id: vizId, position: dashboard?.items.length ?? 0 },
    });
    setLayout((prev) => [
      ...prev,
      { item_id: item.id, x: 0, y: prev.length * 4, w: 6, h: 4 },
    ]);
    void qc.invalidateQueries({ queryKey: ["studio", "dashboard", dashboardId] });
    setPickerOpen(false);
  }

  async function addTextPanel() {
    const item = await addItem.mutateAsync({
      dashboardId,
      body: { panel_type: "text", content: textContent, position: dashboard?.items.length ?? 0 },
    });
    setLayout((prev) => [
      ...prev,
      { item_id: item.id, x: 0, y: prev.length * 4, w: 12, h: 3 },
    ]);
    void qc.invalidateQueries({ queryKey: ["studio", "dashboard", dashboardId] });
  }

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
            className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm"
          >
            <Plus size={14} />
            Add chart
          </button>
          <button
            type="button"
            onClick={() => void addTextPanel()}
            className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm"
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
            className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm"
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
        layout={layout}
        vizById={vizById}
        editable
        onLayoutChange={setLayout}
      />

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
