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
};

export function SchemaBrowser({
  tables,
  isLoading,
  onRefresh,
  onInsert,
  canRefresh,
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
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
      <div className="flex-1 overflow-y-auto p-2 text-sm">
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
                <button
                  type="button"
                  className="flex w-full items-center gap-1 rounded px-1 py-1 text-left hover:bg-slate-50"
                  onClick={() => setOpen((o) => ({ ...o, [t.name]: !isOpen }))}
                >
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Table2 size={14} className="text-slate-400" />
                  <span
                    className="font-medium text-slate-800"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onInsert?.(t.name);
                    }}
                  >
                    {t.name}
                  </span>
                </button>
                {isOpen && (
                  <ul className="ml-6 border-l border-slate-100 pl-2">
                    {t.columns.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          className="w-full rounded px-1 py-0.5 text-left text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                          onClick={() => onInsert?.(c.name)}
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
