import type { QueryResult } from "@/types/studio";
import { formatRawCellValue } from "@/lib/studio/format-cell";

function escapeCsvCell(value: unknown): string {
  const s = value == null ? "" : formatRawCellValue(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Download in-memory query results as CSV (editor preview runs). */
export function downloadQueryResultAsCsv(result: QueryResult, filename = "results.csv"): void {
  const cols = result.columns;
  const lines = [
    cols.map(escapeCsvCell).join(","),
    ...result.rows.map((row) => cols.map((c) => escapeCsvCell(row[c])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
