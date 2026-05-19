export type QueryTemplate = {
  id: string;
  name: string;
  description: string;
  sql: string;
};

/** Starter SQL snippets — replace table/column names with your schema. */
export const QUERY_TEMPLATES: QueryTemplate[] = [
  {
    id: "row-count",
    name: "Row count",
    description: "Count rows in a table to sanity-check connectivity.",
    sql: "SELECT COUNT(*) AS row_count\nFROM your_table\n",
  },
  {
    id: "daily-trend",
    name: "Daily trend",
    description: "Aggregate a metric by day for a simple time series.",
    sql: "SELECT\n  DATE(created_at) AS day,\n  COUNT(*) AS events\nFROM your_table\nWHERE created_at >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY 1\nORDER BY 1\n",
  },
  {
    id: "top-n",
    name: "Top N",
    description: "Rank entities by a numeric column.",
    sql: "SELECT\n  category,\n  SUM(amount) AS total\nFROM your_table\nGROUP BY 1\nORDER BY total DESC\nLIMIT 10\n",
  },
  {
    id: "filtered-sample",
    name: "Parameterized filter",
    description: "Filter with a {{param}} placeholder you can wire in the editor.",
    sql: "SELECT *\nFROM your_table\nWHERE status = {{status}}\nLIMIT 100\n",
  },
  {
    id: "distinct-values",
    name: "Distinct values",
    description: "Explore categorical column cardinality.",
    sql: "SELECT\n  status,\n  COUNT(*) AS cnt\nFROM your_table\nGROUP BY 1\nORDER BY cnt DESC\n",
  },
  {
    id: "null-check",
    name: "Null check",
    description: "Find rows missing a key field.",
    sql: "SELECT *\nFROM your_table\nWHERE important_column IS NULL\nLIMIT 50\n",
  },
];

export function getQueryTemplate(id: string): QueryTemplate | undefined {
  return QUERY_TEMPLATES.find((t) => t.id === id);
}

export const STUDIO_SHOW_TEMPLATES_THRESHOLD = 3;
