"use client";

import { useMemo } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import ReactGridLayout, { type Layout } from "react-grid-layout/legacy";
import { useContainerWidth } from "@/hooks/studio/use-container-width";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { MarkdownPanel } from "./markdown-panel";
import { VisualizationCard } from "./visualization-card";
import type {
  ChartType,
  ColumnFormatRule,
  DashboardLayoutItem,
  QueryResult,
  StudioDashboardItem,
  VisualizationConfig,
} from "@/types/studio";

export type VizPanelData = {
  visualizationId: string;
  name: string;
  chartType: ChartType;
  config: VisualizationConfig;
  columnFormats?: Record<string, ColumnFormatRule>;
  result?: QueryResult | null;
  error?: string | null;
};

type Props = {
  items: StudioDashboardItem[];
  layout: DashboardLayoutItem[];
  vizById: Record<string, VizPanelData>;
  textByItemId?: Record<string, string>;
  loadingVizIds?: ReadonlySet<string>;
  editable?: boolean;
  onLayoutChange?: (layout: DashboardLayoutItem[]) => void;
  onDownloadViz?: (vizId: string) => void;
  onRemoveItem?: (item: StudioDashboardItem) => void;
};

function panelToolbarLabel(
  item: StudioDashboardItem,
  vizById: Record<string, VizPanelData>,
): string {
  if (item.panel_type === "text") {
    const heading = (item.content ?? "")
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("#"));
    if (heading) return heading.replace(/^#+\s*/, "").trim() || "Text panel";
    return "Text panel";
  }
  if (item.visualization_id && vizById[item.visualization_id]) {
    return vizById[item.visualization_id].name;
  }
  return "Chart";
}

function PanelToolbar({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-2 py-1">
      <div className="drag-handle flex min-w-0 flex-1 cursor-move items-center gap-1 text-[10px] font-medium text-slate-400">
        <GripVertical size={12} className="shrink-0" aria-hidden />
        <span className="truncate">{label}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-50"
        aria-label={`Remove ${label}`}
      >
        <Trash2 size={12} />
        Remove
      </button>
    </div>
  );
}

function toDashboardLayout(newLayout: Layout): DashboardLayoutItem[] {
  return newLayout.map((l) => ({
    item_id: l.i,
    x: l.x,
    y: l.y,
    w: l.w,
    h: l.h,
  }));
}

export function DashboardGrid({
  items,
  layout,
  vizById,
  textByItemId = {},
  loadingVizIds,
  editable,
  onLayoutChange,
  onDownloadViz,
  onRemoveItem,
}: Props) {
  const { ref, width } = useContainerWidth();
  const gridLayout: Layout = useMemo(
    () =>
      layout.map((l) => ({
        i: l.item_id,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        minW: 2,
        minH: 2,
      })),
    [layout],
  );

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  function persistLayout(newLayout: Layout) {
    onLayoutChange?.(toDashboardLayout(newLayout));
  }

  if (layout.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        No panels yet
      </div>
    );
  }

  if (width <= 0) {
    return <div ref={ref} className="min-h-[240px] w-full" aria-hidden />;
  }

  return (
    <div ref={ref} className="w-full">
      <ReactGridLayout
        className="layout"
        layout={gridLayout}
        cols={12}
        rowHeight={60}
        width={width}
        isDraggable={!!editable}
        isResizable={!!editable}
        onDragStop={editable ? persistLayout : undefined}
        onResizeStop={editable ? persistLayout : undefined}
        draggableHandle={editable ? ".drag-handle" : undefined}
      >
        {layout.map((l) => {
          const item = itemById.get(l.item_id);
          if (!item) return <div key={l.item_id} />;

          const label = panelToolbarLabel(item, vizById);

          if (item.panel_type === "text") {
            return (
              <div
                key={l.item_id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                {editable && onRemoveItem && (
                  <PanelToolbar label={label} onRemove={() => onRemoveItem(item)} />
                )}
                <div className="min-h-0 flex-1 overflow-auto">
                  <MarkdownPanel content={item.content ?? textByItemId[item.id] ?? ""} />
                </div>
              </div>
            );
          }

          const viz = item.visualization_id ? vizById[item.visualization_id] : null;

          if (!viz) {
            return (
              <div
                key={l.item_id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                {editable && onRemoveItem && (
                  <PanelToolbar label={label} onRemove={() => onRemoveItem(item)} />
                )}
                <div className="flex flex-1 items-center justify-center p-4 text-sm text-slate-400">
                  Visualization unavailable
                </div>
              </div>
            );
          }

          const vizLoading = loadingVizIds?.has(viz.visualizationId) ?? false;

          return (
            <div key={l.item_id} className="flex h-full flex-col overflow-hidden">
              {editable && onRemoveItem && (
                <PanelToolbar label={label} onRemove={() => onRemoveItem(item)} />
              )}
              <div className="min-h-0 flex-1">
                <VisualizationCard
                  name={viz.name}
                  chartType={viz.chartType}
                  config={viz.config}
                  result={viz.result ?? null}
                  columnFormats={viz.columnFormats}
                  error={viz.error}
                  loading={vizLoading}
                  onDownload={onDownloadViz ? () => onDownloadViz(viz.visualizationId) : undefined}
                />
              </div>
            </div>
          );
        })}
      </ReactGridLayout>
    </div>
  );
}
