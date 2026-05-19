"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, RefreshCw, Table2 } from "lucide-react";
import type { SchemaTable } from "@/types/studio";

type Props = {
  tables: SchemaTable[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onInsert?: (text: string) => void;
  canRefresh?: boolean;
  className?: string;
};

export function SchemaBrowser({
  tables,
  isLoading,
  onRefresh,
  onInsert,
  canRefresh,
  className,
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div
      className={`flex h-[calc(100vh-13rem)] max-h-[640px] min-h-[300px] w-full flex-col rounded-lg border border-slate-200 bg-white${className ? ` ${className}` : ""}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Schema
        </span>
        {canRefresh && onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Refresh schema"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-scroll overscroll-contain p-2 text-sm [scrollbar-gutter:stable]">
        {isLoading && tables.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-slate-400">Loading schema…</p>
        ) : tables.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-slate-400">
            No tables. Connect a database first.
          </p>
        ) : (
          tables.map((t) => {
            const isOpen = open[t.name] ?? false;
            return (
              <div key={t.name} className="mb-0.5">
                <div className="flex items-center gap-0.5 rounded hover:bg-slate-50">
                  <button
                    type="button"
                    className="flex h-7 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    onClick={() => setOpen((o) => ({ ...o, [t.name]: !isOpen }))}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${t.name}`}
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1 rounded px-1 py-1 text-left"
                    onClick={() => onInsert?.(t.name)}
                    title="Insert table name into query"
                  >
                    <Table2 size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate font-medium text-slate-800">{t.name}</span>
                  </button>
                </div>
                {isOpen && (
                  <ul className="ml-7 border-l border-slate-100 pl-2">
                    {t.columns.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          className="w-full rounded px-1 py-0.5 text-left text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                          onClick={() => onInsert?.(c.name)}
                          title="Insert column name into query"
                        >
                          <span className="font-mono">{c.name}</span>
                          <span className="ml-1 text-slate-400">{c.data_type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
