import { api } from "./client";

export type AnalyticsRiskTrendPoint = {
  t: string;
  avg_risk_score: number;
  samples: number;
};

export type AnalyticsRiskTrendResponse = {
  period: string;
  granularity: string;
  series: AnalyticsRiskTrendPoint[];
};

export const analyticsApi = {
  overview: (period = "30d") =>
    api.get<Record<string, unknown>>(`/analytics/overview?period=${period}`),
  riskTrend: (period = "30d", granularity = "week") =>
    api.get<AnalyticsRiskTrendResponse>(
      `/analytics/risk-trend?period=${period}&granularity=${granularity}`,
    ),
  segments: () =>
    api.get<Record<string, unknown>>("/analytics/segments"),
  cohorts: (period = "30d") =>
    api.get<Record<string, unknown>>(`/analytics/cohorts?period=${period}`),
  pipelinePerformance: () =>
    api.get<Record<string, unknown>>("/analytics/pipeline-performance"),
};
