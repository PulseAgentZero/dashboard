import { api } from "./client";
import type {
  DashboardsListResponse,
  DashboardLayoutItem,
  EmbedTokenResponse,
  ExplainQueryResponse,
  GenerateSQLResponse,
  PublicDashboard,
  QueriesListResponse,
  QueryParamDefinition,
  QueryResult,
  QueryRunsListResponse,
  RecommendVizResponse,
  SchemaResponse,
  StudioDashboard,
  StudioDashboardExecuteResponse,
  StudioQuery,
  StudioQueryRun,
  StudioVisualization,
  VisualizationsListResponse,
} from "@/types/studio";

const STUDIO = "/studio";

export type ListQueriesParams = {
  page?: number;
  limit?: number;
  q?: string;
  tags?: string;
  starred?: boolean;
};

export type ListDashboardsParams = ListQueriesParams;

export const studioApi = {
  getSchema: (connectionId?: string) => {
    const q = connectionId ? `?connection_id=${connectionId}` : "";
    return api.get<SchemaResponse>(`${STUDIO}/schema${q}`);
  },

  refreshSchema: (connectionId?: string) => {
    const q = connectionId ? `?connection_id=${connectionId}` : "";
    return api.post<SchemaResponse>(`${STUDIO}/schema/refresh${q}`, {});
  },

  executeQuery: (body: {
    sql_text: string;
    connection_id?: string | null;
    param_values?: Record<string, unknown>;
    page?: number;
    page_size?: number;
  }) => api.post<QueryResult>(`${STUDIO}/query/execute`, body),

  listQueries: (params: ListQueriesParams = {}) => {
    const sp = new URLSearchParams();
    if (params.page) sp.set("page", String(params.page));
    if (params.limit) sp.set("limit", String(params.limit));
    if (params.q) sp.set("q", params.q);
    if (params.tags) sp.set("tags", params.tags);
    if (params.starred) sp.set("starred", "true");
    const q = sp.toString();
    return api.get<QueriesListResponse>(`${STUDIO}/queries${q ? `?${q}` : ""}`);
  },

  getQuery: (id: string) => api.get<StudioQuery>(`${STUDIO}/queries/${id}`),

  createQuery: (body: {
    name: string;
    description?: string | null;
    sql_text: string;
    connection_id?: string | null;
    params?: QueryParamDefinition[];
    tags?: string[];
    refresh_cron?: string | null;
    refresh_enabled?: boolean;
  }) => api.post<StudioQuery>(`${STUDIO}/queries`, body),

  updateQuery: (
    id: string,
    body: Partial<{
      name: string;
      description: string | null;
      sql_text: string;
      connection_id: string | null;
      params: QueryParamDefinition[];
      tags: string[];
      refresh_cron: string | null;
      refresh_enabled: boolean;
    }>,
  ) => api.patch<StudioQuery>(`${STUDIO}/queries/${id}`, body),

  deleteQuery: (id: string) => api.delete<void>(`${STUDIO}/queries/${id}`),

  generateSQL: (body: { goal: string; connection_id?: string | null }) =>
    api.post<GenerateSQLResponse>(`${STUDIO}/queries/generate`, body),

  explainQuery: (id: string) => api.get<ExplainQueryResponse>(`${STUDIO}/queries/${id}/explain`),

  recommendViz: (id: string) => api.post<RecommendVizResponse>(`${STUDIO}/queries/${id}/recommend-viz`, {}),

  runQuery: (
    id: string,
    body: { param_values?: Record<string, unknown>; page?: number; page_size?: number } = {},
  ) => api.post<StudioQueryRun>(`${STUDIO}/queries/${id}/run`, body),

  listQueryRuns: (id: string, limit = 20) =>
    api.get<QueryRunsListResponse>(`${STUDIO}/queries/${id}/runs?limit=${limit}`),

  starQuery: (id: string) => api.post<void>(`${STUDIO}/queries/${id}/star`, {}),

  unstarQuery: (id: string) => api.delete<void>(`${STUDIO}/queries/${id}/star`),

  getRun: (runId: string) => api.get<StudioQueryRun>(`${STUDIO}/runs/${runId}`),

  downloadRunUrl: (runId: string, format: "csv" | "json" = "csv") => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${base}/api/v1${STUDIO}/runs/${runId}/download?format=${format}`;
  },

  listVisualizations: (queryId: string) =>
    api.get<VisualizationsListResponse>(`${STUDIO}/queries/${queryId}/visualizations`),

  createVisualization: (
    queryId: string,
    body: {
      name: string;
      chart_type: string;
      config?: Record<string, unknown>;
      column_formats?: Record<string, unknown>;
    },
  ) => api.post<StudioVisualization>(`${STUDIO}/queries/${queryId}/visualizations`, body),

  updateVisualization: (
    queryId: string,
    vizId: string,
    body: Partial<{
      name: string;
      chart_type: string;
      config: Record<string, unknown>;
      column_formats: Record<string, unknown>;
    }>,
  ) => api.patch<StudioVisualization>(`${STUDIO}/queries/${queryId}/visualizations/${vizId}`, body),

  deleteVisualization: (queryId: string, vizId: string) =>
    api.delete<void>(`${STUDIO}/queries/${queryId}/visualizations/${vizId}`),

  listDashboards: (params: ListDashboardsParams = {}) => {
    const sp = new URLSearchParams();
    if (params.page) sp.set("page", String(params.page));
    if (params.limit) sp.set("limit", String(params.limit));
    if (params.q) sp.set("q", params.q);
    if (params.tags) sp.set("tags", params.tags);
    if (params.starred) sp.set("starred", "true");
    const q = sp.toString();
    return api.get<DashboardsListResponse>(`${STUDIO}/dashboards${q ? `?${q}` : ""}`);
  },

  getDashboard: (id: string) => api.get<StudioDashboard>(`${STUDIO}/dashboards/${id}`),

  createDashboard: (body: {
    name: string;
    description?: string | null;
    is_public?: boolean;
    layout?: DashboardLayoutItem[];
    dashboard_params?: QueryParamDefinition[];
    tags?: string[];
  }) => api.post<StudioDashboard>(`${STUDIO}/dashboards`, body),

  updateDashboard: (
    id: string,
    body: Partial<{
      name: string;
      description: string | null;
      is_public: boolean;
      layout: DashboardLayoutItem[];
      dashboard_params: QueryParamDefinition[];
      tags: string[];
    }>,
  ) => api.patch<StudioDashboard>(`${STUDIO}/dashboards/${id}`, body),

  deleteDashboard: (id: string) => api.delete<void>(`${STUDIO}/dashboards/${id}`),

  executeDashboard: (id: string, param_values: Record<string, unknown> = {}) =>
    api.post<StudioDashboardExecuteResponse>(`${STUDIO}/dashboards/${id}/execute`, { param_values }),

  forkDashboard: (id: string, name?: string) =>
    api.post<StudioDashboard>(`${STUDIO}/dashboards/${id}/fork`, name ? { name } : {}),

  starDashboard: (id: string) => api.post<void>(`${STUDIO}/dashboards/${id}/star`, {}),

  unstarDashboard: (id: string) => api.delete<void>(`${STUDIO}/dashboards/${id}/star`),

  createEmbedToken: (id: string, expiresInHours = 24) =>
    api.post<EmbedTokenResponse>(`${STUDIO}/dashboards/${id}/embed-token`, {
      expires_in_hours: expiresInHours,
    }),

  addDashboardItem: (
    id: string,
    body: {
      panel_type: "visualization" | "text";
      visualization_id?: string;
      content?: string;
      position?: number;
    },
  ) => api.post<import("@/types/studio").StudioDashboardItem>(`${STUDIO}/dashboards/${id}/items`, body),

  deleteDashboardItem: (dashboardId: string, itemId: string) =>
    api.delete<void>(`${STUDIO}/dashboards/${dashboardId}/items/${itemId}`),
};
