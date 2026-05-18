"use client";

import { useMemo } from "react";
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
  loading?: boolean;
  editable?: boolean;
  onLayoutChange?: (layout: DashboardLayoutItem[]) => void;
  onDownloadViz?: (vizId: string) => void;
};

export function DashboardGrid({
  items,
  layout,
  vizById,
  textByItemId = {},
  loading,
  editable,
  onLayoutChange,
  onDownloadViz,
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

  function handleLayoutChange(newLayout: Layout) {
    if (!onLayoutChange) return;
    onLayoutChange(
      newLayout.map((l) => {
        const prev = layout.find((x) => x.item_id === l.i);
        return {
          item_id: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
        };
      }),
    );
  }

  if (layout.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        No panels yet
      </div>
    );
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
      onLayoutChange={handleLayoutChange}
      draggableHandle={editable ? ".drag-handle" : undefined}
    >
      {layout.map((l) => {
        const item = itemById.get(l.item_id);
        if (!item) return <div key={l.item_id} />;

        if (item.panel_type === "text") {
          return (
            <div key={l.item_id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {editable && <div className="drag-handle cursor-move bg-slate-50 px-2 py-1 text-[10px] text-slate-400">Drag</div>}
              <MarkdownPanel content={item.content ?? textByItemId[item.id] ?? ""} />
            </div>
          );
        }

        const viz = item.visualization_id ? vizById[item.visualization_id] : null;
        if (!viz) {
          return (
            <div key={l.item_id} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">
              Visualization unavailable
            </div>
          );
        }

        return (
          <div key={l.item_id} className="h-full">
            {editable && <div className="drag-handle cursor-move rounded-t bg-slate-50 px-2 py-0.5 text-[10px] text-slate-400">Drag</div>}
            <VisualizationCard
              name={viz.name}
              chartType={viz.chartType}
              config={viz.config}
              result={viz.result ?? null}
              columnFormats={viz.columnFormats}
              error={viz.error}
              loading={loading}
              onDownload={onDownloadViz ? () => onDownloadViz(viz.visualizationId) : undefined}
            />
          </div>
        );
      })}
    </ReactGridLayout>
    </div>
  );
}
