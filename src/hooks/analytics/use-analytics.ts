import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics-api";

export function useAnalyticsOverview(period = "30d") {
  return useQuery({
    queryKey: ["analytics", "overview", period],
    queryFn: () => analyticsApi.overview(period),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsSegments() {
  return useQuery({
    queryKey: ["analytics", "segments"],
    queryFn: analyticsApi.segments,
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsCohorts(period = "30d") {
  return useQuery({
    queryKey: ["analytics", "cohorts", period],
    queryFn: () => analyticsApi.cohorts(period),
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsRiskTrend(period = "30d", granularity = "day") {
  return useQuery({
    queryKey: ["analytics", "risk-trend", period, granularity],
    queryFn: () => analyticsApi.riskTrend(period, granularity),
    staleTime: 60_000,
    retry: false,
  });
}

export function usePipelinePerformance() {
  return useQuery({
    queryKey: ["analytics", "pipeline-performance"],
    queryFn: analyticsApi.pipelinePerformance,
    staleTime: 60_000,
    retry: false,
  });
}
