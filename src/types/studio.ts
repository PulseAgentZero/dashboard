export type ParamType = "text" | "number" | "date" | "datetime";

export type ChartType =
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "scatter"
  | "table"
  | "number"
  | "funnel"
  | "heatmap"
  | "gauge"
  | "waterfall"
  | "trend"
  | "stat"
  | "bar_gauge"
  | "histogram";

export type QueryParamDefinition = {
  name: string;
  type: ParamType;
  default_value?: string | null;
  description?: string | null;
  label?: string | null;
};

export type ColumnFormatRule = {
  type: "currency" | "percent" | "date" | "badge" | "number";
  symbol?: string | null;
  decimals?: number | null;
  format?: string | null;
  colors?: Record<string, string> | null;
};

export type LegendPosition = "top" | "bottom" | "left" | "right";

export type ChartDisplayOptions = {
  show_legend?: boolean;
  legend_position?: LegendPosition;
  show_grid?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  x_label_rotate?: number;
  x_label_max_chars?: number;
  max_points?: number;
};

export type ChartAxesLabels = {
  x_label?: string | null;
  y_label?: string | null;
};

export type VisualizationConfig = {
  x_axis?: string | null;
  y_axis?: string | string[] | null;
  color?: string | null;
  title?: string | null;
  value_column?: string | null;
  label_column?: string | null;
  min_value?: number | null;
  max_value?: number | null;
  unit?: string | null;
  sparkline_column?: string | null;
  colors?: string[] | null;
  series_colors?: Record<string, string> | null;
  display?: ChartDisplayOptions | null;
  axes?: ChartAxesLabels | null;
};

export type DashboardLayoutItem = {
  item_id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SchemaColumn = {
  name: string;
  data_type: string;
  nullable: boolean;
};

export type SchemaTable = {
  name: string;
  columns: SchemaColumn[];
};

export type SchemaResponse = {
  tables: SchemaTable[];
};

export type QueryResult = {
  rows: Record<string, unknown>[];
  columns: string[];
  total: number;
  page: number;
  page_size: number;
  cached: boolean;
};

export type StudioQuery = {
  id: string;
  org_id: string;
  connection_id: string | null;
  created_by: string | null;
  name: string;
  description: string | null;
  sql_text: string;
  params: QueryParamDefinition[];
  tags: string[];
  refresh_cron: string | null;
  refresh_enabled: boolean;
  last_run_at: string | null;
  last_run_row_count: number | null;
  created_at: string;
  updated_at: string;
  starred: boolean;
};

export type StudioQueryRun = {
  id: string;
  org_id: string;
  query_id: string | null;
  triggered_by: string | null;
  status: string;
  param_values: Record<string, unknown>;
  row_count: number | null;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  result?: QueryResult | null;
};

export type StudioVisualization = {
  id: string;
  org_id: string;
  query_id: string;
  created_by: string | null;
  name: string;
  chart_type: ChartType;
  config: VisualizationConfig;
  column_formats: Record<string, ColumnFormatRule>;
  created_at: string;
  updated_at: string;
};

export type StudioDashboardItem = {
  id: string;
  dashboard_id: string;
  visualization_id: string | null;
  position: number;
  panel_type: "visualization" | "text";
  content: string | null;
  created_at: string;
};

export type StudioDashboard = {
  id: string;
  org_id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  slug: string | null;
  is_public: boolean;
  layout: DashboardLayoutItem[];
  dashboard_params: QueryParamDefinition[];
  tags: string[];
  created_at: string;
  updated_at: string;
  items: StudioDashboardItem[];
  starred: boolean;
};

export type DashboardExecuteResult = {
  visualization_id: string;
  result: QueryResult | null;
  error: string | null;
};

export type StudioDashboardExecuteResponse = {
  results: DashboardExecuteResult[];
};

export type GenerateSQLResponse = {
  sql: string;
  explanation: string;
  params: QueryParamDefinition[];
};

export type RecommendVizResponse = {
  chart_type: ChartType;
  config: VisualizationConfig;
  reasoning: string;
};

export type ExplainQueryResponse = {
  explanation: string;
};

export type EmbedTokenResponse = {
  token: string;
  embed_url: string;
  expires_at: string;
};

export type PublicVisualization = {
  id: string;
  name: string;
  chart_type: ChartType;
  config: VisualizationConfig;
  column_formats: Record<string, ColumnFormatRule>;
  query_result: QueryResult | null;
};

export type PublicDashboard = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  layout: DashboardLayoutItem[];
  dashboard_params: QueryParamDefinition[];
  visualizations: PublicVisualization[];
};

export type QueriesListResponse = {
  queries: StudioQuery[];
  total: number;
  page: number;
};

export type DashboardsListResponse = {
  dashboards: StudioDashboard[];
  total: number;
  page: number;
};

export type VisualizationsListResponse = {
  visualizations: StudioVisualization[];
};

export type QueryRunsListResponse = {
  runs: StudioQueryRun[];
};
