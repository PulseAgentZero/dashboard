"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { VizPanelData } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardFilterBar } from "@/components/studio/dashboard/dashboard-filter-bar";
import { DashboardGrid } from "@/components/studio/dashboard/dashboard-grid";
import { DashboardToolbar } from "@/components/studio/dashboard/dashboard-toolbar";
import { useDashboardAutoRefresh } from "@/hooks/studio/use-dashboard-auto-refresh";
import { clampEmbedRefresh } from "@/lib/studio/refresh-presets";
import { normalizeTimeRange, type DashboardTimeRange } from "@/lib/studio/time-range";
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
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>(() =>
    normalizeTimeRange(dashboard.time_range),
  );
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number | null>(() =>
    clampEmbedRefresh(dashboard.refresh_interval_seconds ?? null),
  );
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  useEffect(() => {
    setTimeRange(normalizeTimeRange(dashboard.time_range));
    setRefreshIntervalSeconds(clampEmbedRefresh(dashboard.refresh_interval_seconds ?? null));
  }, [dashboard.id, dashboard.time_range, dashboard.refresh_interval_seconds]);

  const buildFilterPayload = useCallback(
    (values: Record<string, string>, range: DashboardTimeRange) => {
      const payload: Record<string, string> = { ...values, time_preset: range.preset };
      if (range.preset === "custom") {
        if (range.from) payload.time_from = range.from;
        if (range.to) payload.time_to = range.to;
      }
      return payload;
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    onFilterApply(buildFilterPayload(filterValues, timeRange));
    setLastRefreshedAt(new Date());
  }, [filterValues, timeRange, buildFilterPayload, onFilterApply]);

  useDashboardAutoRefresh({
    intervalSeconds: refreshIntervalSeconds,
    onRefresh: handleRefresh,
    enabled: true,
  });

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

  const loadingVizIds = useMemo(() => {
    if (!loading) return new Set<string>();
    return new Set(dashboard.visualizations.map((v) => v.id));
  }, [loading, dashboard.visualizations]);

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

      <DashboardToolbar
        timeRange={timeRange}
        onTimeRangeChange={(range) => {
          setTimeRange(range);
          onFilterApply(buildFilterPayload(filterValues, range));
          setLastRefreshedAt(new Date());
        }}
        refreshIntervalSeconds={refreshIntervalSeconds}
        onRefreshIntervalChange={(s) => setRefreshIntervalSeconds(clampEmbedRefresh(s))}
        onManualRefresh={handleRefresh}
        lastRefreshedAt={lastRefreshedAt}
        loading={loading}
        embedMode
      />

      <DashboardFilterBar
        params={dashboard.dashboard_params ?? []}
        initialValues={filterValues}
        onApply={(v) => onFilterApply(buildFilterPayload(v, timeRange))}
        loading={loading}
        autoApplyOnChange
      />

      <DashboardGrid
        items={items}
        layout={layout}
        vizById={vizById}
        loadingVizIds={loadingVizIds}
      />

      {showFooter && (
        <footer className="mt-8 text-center text-xs text-slate-400">Powered by Pulse</footer>
      )}
    </div>
  );
}
