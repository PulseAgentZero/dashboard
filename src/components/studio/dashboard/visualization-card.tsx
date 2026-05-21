"use client";

import { Download, Loader2 } from "lucide-react";
import { ChartRenderer } from "@/components/studio/charts/chart-renderer";
import type {
  ChartType,
  ColumnFormatRule,
  QueryResult,
  VisualizationConfig,
} from "@/types/studio";

type Props = {
  name: string;
  chartType: ChartType;
  config: VisualizationConfig;
  result: QueryResult | null;
  columnFormats?: Record<string, ColumnFormatRule>;
  error?: string | null;
  loading?: boolean;
  onDownload?: () => void;
};

export function VisualizationCard({
  name,
  chartType,
  config,
  result,
  columnFormats,
  error,
  loading,
  onDownload,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <h3 className="text-sm font-semibold text-slate-800">{name}</h3>
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Download CSV"
          >
            <Download size={14} />
          </button>
        )}
      </div>
      <div className="relative flex-1 p-3">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
          </div>
        )}
        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : (
          <ChartRenderer
            chartType={chartType}
            config={config}
            result={result}
            columnFormats={columnFormats}
            height={220}
          />
        )}
      </div>
    </div>
  );
}
