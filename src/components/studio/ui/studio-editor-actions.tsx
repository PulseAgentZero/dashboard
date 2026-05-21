"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Download,
  Loader2,
  MoreHorizontal,
  Play,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";

type Props = {
  onRun: () => void;
  runDisabled?: boolean;
  runPending?: boolean;
  onSave: () => void;
  saveDisabled?: boolean;
  saveHidden?: boolean;
  saveTitle?: string;
  onAiSql?: () => void;
  aiSqlActive?: boolean;
  onExplain?: () => void;
  showExplain?: boolean;
  explainPending?: boolean;
  onDownloadCsv?: () => void;
  showDownload?: boolean;
  onChart?: () => void;
  showChart?: boolean;
};

export function StudioEditorActions({
  onRun,
  runDisabled,
  runPending,
  onSave,
  saveDisabled,
  saveHidden,
  saveTitle = "Save query",
  onAiSql,
  aiSqlActive,
  onExplain,
  showExplain,
  explainPending,
  onDownloadCsv,
  showDownload,
  onChart,
  showChart,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen]);

  const moreItems = [
    onAiSql && {
      key: "ai",
      label: aiSqlActive ? "Hide AI SQL" : "Generate with AI",
      icon: Sparkles,
      onClick: () => {
        onAiSql();
        setMoreOpen(false);
      },
    },
    showExplain &&
      onExplain && {
        key: "explain",
        label: "Explain query",
        icon: Wand2,
        onClick: () => {
          onExplain();
          setMoreOpen(false);
        },
        pending: explainPending,
      },
    showDownload &&
      onDownloadCsv && {
        key: "csv",
        label: "Download CSV",
        icon: Download,
        onClick: () => {
          onDownloadCsv();
          setMoreOpen(false);
        },
      },
    showChart &&
      onChart && {
        key: "chart",
        label: "Create chart",
        icon: BarChart3,
        onClick: () => {
          onChart();
          setMoreOpen(false);
        },
      },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    pending?: boolean;
  }>;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onRun}
        disabled={runDisabled || runPending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
      >
        {runPending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Play size={15} />
        )}
        Run
      </button>

      {!saveHidden && (
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          title={saveDisabled ? saveTitle : undefined}
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={15} />
          Save
        </button>
      )}

      {moreItems.length > 0 && (
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
          >
            <MoreHorizontal size={16} />
            <span className="hidden sm:inline">More</span>
          </button>
          {moreOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-slate-900/5"
            >
              {moreItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  onClick={item.onClick}
                  disabled={item.pending}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {item.pending ? (
                    <Loader2 size={14} className="animate-spin text-slate-400" />
                  ) : (
                    <item.icon size={14} className="text-slate-500" />
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
