import type { SchemaTableInfo } from "@/types/schema-mapping";

function inferCol(
  columns: { name: string }[],
  ...patterns: string[]
): string | null {
  const colMap = new Map(columns.map((c) => [c.name.toLowerCase(), c.name]));
  for (const pat of patterns) {
    for (const [lower, original] of colMap) {
      if (
        lower === pat ||
        lower.endsWith(`_${pat}`) ||
        lower.startsWith(`${pat}_`)
      ) {
        return original;
      }
    }
  }
  return null;
}

function scoreTable(
  table: SchemaTableInfo,
  entityLabel: string | null | undefined,
): number {
  const name = table.name.toLowerCase();
  const entityKw = (entityLabel ?? "").toLowerCase().trim();
  if (entityKw && (name.includes(entityKw) || entityKw.includes(name))) {
    return 3;
  }
  if (
    ["customer", "user", "subscriber", "patient", "client", "member", "account"].some(
      (kw) => name.includes(kw),
    )
  ) {
    return 2;
  }
  if (
    ["log", "audit", "config", "setting", "migration", "session", "token"].some(
      (kw) => name.includes(kw),
    )
  ) {
    return 0;
  }
  return 1;
}

function isLikelySignalColumn(dataType: string): boolean {
  const t = dataType.toLowerCase();
  return (
    t.includes("int") ||
    t.includes("numeric") ||
    t.includes("decimal") ||
    t.includes("float") ||
    t.includes("double") ||
    t.includes("real") ||
    t.includes("number") ||
    t.includes("bool")
  );
}

export type InferredMapping = {
  entity_table: string;
  entity_id_col: string;
  entity_name_col: string | null;
  timestamp_col: string | null;
  target_column: string | null;
  signal_columns: Record<string, string>;
};

export function inferMappingFromSchema(
  tables: SchemaTableInfo[],
  options?: {
    entityLabel?: string | null;
    goalLabel?: string | null;
  },
): InferredMapping | null {
  if (!tables.length) return null;

  const best = [...tables].sort(
    (a, b) => scoreTable(b, options?.entityLabel) - scoreTable(a, options?.entityLabel),
  )[0];

  const cols = best.columns;
  if (!cols.length) return null;

  const entity_id_col =
    inferCol(cols, "id", "uuid", "key", "pk") ?? cols[0].name;
  const entity_name_col = inferCol(
    cols,
    "name",
    "full_name",
    "fullname",
    "display_name",
    "title",
    "email",
    "username",
  );

  const timestamp_col = inferCol(
    cols,
    "created_at",
    "timestamp",
    "date",
    "updated_at",
    "event_date",
  );

  const goalKw = (options?.goalLabel ?? "").toLowerCase();
  let target_column: string | null = null;
  if (goalKw.includes("churn")) {
    target_column = inferCol(cols, "churned", "churn", "is_active", "active", "status");
  } else if (goalKw.includes("stock") || goalKw.includes("inventor")) {
    target_column = inferCol(cols, "stock", "quantity", "inventory", "qty");
  } else if (goalKw.includes("risk")) {
    target_column = inferCol(cols, "risk", "risk_score", "risk_tier", "score");
  }

  const signal_columns: Record<string, string> = {};
  for (const col of cols) {
    if (col.name === entity_id_col) continue;
    if (col.name === entity_name_col) continue;
    if (col.name === timestamp_col) continue;
    if (col.name === target_column) continue;
    if (!isLikelySignalColumn(col.data_type)) continue;
    const label = col.name.replace(/_/g, " ");
    if (!signal_columns[label]) {
      signal_columns[label] = col.name;
    }
    if (Object.keys(signal_columns).length >= 8) break;
  }

  return {
    entity_table: best.name,
    entity_id_col,
    entity_name_col,
    timestamp_col,
    target_column,
    signal_columns,
  };
}

export function buildRawSchema(tables: SchemaTableInfo[]) {
  return { tables };
}
