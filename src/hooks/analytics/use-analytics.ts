import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics-api";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useAnalyticsOverview(period = "30d") {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["analytics", "overview", period],
    queryFn: () => analyticsApi.overview(period),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsSegments() {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["analytics", "segments"],
    queryFn: analyticsApi.segments,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsCohorts(period = "30d") {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["analytics", "cohorts", period],
    queryFn: () => analyticsApi.cohorts(period),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useAnalyticsRiskTrend(period = "30d", granularity = "week") {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["analytics", "risk-trend", period, granularity],
    queryFn: () => analyticsApi.riskTrend(period, granularity),
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function usePipelinePerformance() {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["analytics", "pipeline-performance"],
    queryFn: analyticsApi.pipelinePerformance,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
