"use client";

import { useMemo } from "react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardFilterBar } from "@/components/studio/dashboard/dashboard-filter-bar";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import type { DashboardLayoutItem, PublicDashboard, StudioDashboardItem } from "@/types/studio";

type Props = {
  dashboard: PublicDashboard;
  filterValues: Record<string, string>;
  onFilterApply: (values: Record<string, string>) => void;
  loading?: boolean;
  showFooter?: boolean;
  minimal?: boolean;
};

export function PublicDashboardDisplay({
  dashboard,
  filterValues,
  onFilterApply,
  loading,
  showFooter,
  minimal,
}: Props) {
  const { items, layout, vizById } = useMemo(() => {
    const vizById: Record<string, VizPanelData> = {};
    const items: StudioDashboardItem[] = [];
    const layout: DashboardLayoutItem[] = [];

    dashboard.visualizations.forEach((v, i) => {
      const layoutSlot = dashboard.layout[i];
      const itemId = layoutSlot?.item_id ?? v.id;
      items.push({
        id: itemId,
        dashboard_id: dashboard.id,
        visualization_id: v.id,
        position: i,
        panel_type: "visualization",
        content: null,
        created_at: "",
      });
      layout.push(
        layoutSlot ?? {
          item_id: itemId,
          x: (i % 2) * 6,
          y: Math.floor(i / 2) * 4,
          w: 6,
          h: 4,
        },
      );
      vizById[v.id] = {
        visualizationId: v.id,
        name: v.name,
        chartType: v.chart_type,
        config: v.config,
        columnFormats: v.column_formats,
        result: v.query_result,
        error: v.query_result ? null : "No data",
      };
    });

    return { items, layout, vizById };
  }, [dashboard]);

  return (
    <div className={minimal ? "min-h-screen bg-[#f6f8fb] p-4" : "space-y-4"}>
      {!minimal && (
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{dashboard.name}</h1>
          {dashboard.description && (
            <p className="mt-1 text-slate-600">{dashboard.description}</p>
          )}
        </header>
      )}

      <DashboardFilterBar
        params={dashboard.dashboard_params ?? []}
        initialValues={filterValues}
        onApply={onFilterApply}
        loading={loading}
      />

      <DashboardGrid items={items} layout={layout} vizById={vizById} loading={loading} />

      {showFooter && (
        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          Powered by Pulse
        </footer>
      )}
    </div>
  );
}
