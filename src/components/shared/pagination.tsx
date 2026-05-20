"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTotalPages } from "@/lib/pagination";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** When false, hide controls if only one page (default true). */
  hideWhenSingle?: boolean;
  className?: string;
};

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  hideWhenSingle = true,
  className = "",
}: PaginationProps) {
  const totalPages = getTotalPages(total, pageSize);

  if (hideWhenSingle && totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${className}`}
    >
      <p className="text-xs text-slate-400">
        Page {page} of {totalPages}
        {total > 0 ? ` · ${total.toLocaleString()} total` : ""}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 sm:min-w-0"
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 sm:min-w-0"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
