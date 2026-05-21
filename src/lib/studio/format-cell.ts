import type { ColumnFormatRule } from "@/types/studio";

/** Display JSON/object columns as JSON text instead of `[object Object]`. */
export function formatRawCellValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function formatCellValue(value: unknown, rule?: ColumnFormatRule | null): string {
  if (value == null) return "—";
  if (!rule) return formatRawCellValue(value);

  const n = Number(value);
  switch (rule.type) {
    case "currency":
      if (Number.isFinite(n)) {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: rule.symbol ?? "USD",
          minimumFractionDigits: rule.decimals ?? 2,
          maximumFractionDigits: rule.decimals ?? 2,
        }).format(n);
      }
      break;
    case "percent":
      if (Number.isFinite(n)) {
        return `${(n * 100).toFixed(rule.decimals ?? 1)}%`;
      }
      break;
    case "number":
      if (Number.isFinite(n)) {
        return n.toLocaleString(undefined, {
          minimumFractionDigits: rule.decimals ?? 0,
          maximumFractionDigits: rule.decimals ?? 2,
        });
      }
      break;
    case "date":
      try {
        return new Date(String(value)).toLocaleDateString();
      } catch {
        break;
      }
    case "badge":
      return formatRawCellValue(value);
    default:
      break;
  }
  return formatRawCellValue(value);
}
