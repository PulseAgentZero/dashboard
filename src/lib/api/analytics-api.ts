import { api } from "./client";

export const analyticsApi = {
  overview: (period = "30d") =>
    api.get<Record<string, unknown>>(`/analytics/overview?period=${period}`),
  riskTrend: (period = "30d", granularity = "day") =>
    api.get<Record<string, unknown>>(`/analytics/risk-trend?period=${period}&granularity=${granularity}`),
  segments: () =>
    api.get<Record<string, unknown>>("/analytics/segments"),
  cohorts: (period = "30d") =>
    api.get<Record<string, unknown>>(`/analytics/cohorts?period=${period}`),
  pipelinePerformance: () =>
    api.get<Record<string, unknown>>("/analytics/pipeline-performance"),
};
