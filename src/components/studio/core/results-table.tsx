"use client";

import { useMemo, useState } from "react";
import { formatCellValue } from "@/lib/studio/format-cell";
import type { ColumnFormatRule, QueryResult } from "@/types/studio";

type Props = {
  result: QueryResult | null;
  columnFormats?: Record<string, ColumnFormatRule>;
  onPageChange?: (page: number) => void;
};

export function ResultsTable({ result, columnFormats = {}, onPageChange }: Props) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    if (!result?.rows) return [];
    const copy = [...result.rows];
    if (!sortCol) return copy;
    copy.sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [result?.rows, sortCol, sortDir]);

  if (!result) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
        Run a query to see results
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No columns returned
      </div>
    );
  }

  function toggleSort(col: string) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  const totalPages = Math.max(1, Math.ceil(result.total / result.page_size));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
        <span>
          {result.total.toLocaleString()} rows
          {result.cached && " · cached"}
        </span>
        {onPageChange && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={result.page <= 1}
              onClick={() => onPageChange(result.page - 1)}
              className="rounded border px-2 py-0.5 disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              {result.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={result.page >= totalPages}
              onClick={() => onPageChange(result.page + 1)}
              className="rounded border px-2 py-0.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <div className="max-h-[60dvh] overflow-auto lg:max-h-[50dvh]">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              {result.columns.map((col) => (
                <th
                  key={col}
                  className="cursor-pointer whitespace-nowrap px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                  onClick={() => toggleSort(col)}
                >
                  {col}
                  {sortCol === col && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50">
                {result.columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-3 py-1.5 text-slate-800">
                    {formatCellValue(row[col], columnFormats[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
