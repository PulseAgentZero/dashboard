import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

type RiskTrendPoint = {
  date: string;
  avg_risk_score: number;
  count: number;
};

type RiskTrendResponse = {
  period: string;
  granularity: string;
  series: RiskTrendPoint[];
};

export function useRiskTrend(period = "30d", granularity = "week") {
  return useQuery({
    queryKey: ["analytics", "risk-trend", period, granularity],
    queryFn: () =>
      api.get<RiskTrendResponse>(
        `/analytics/risk-trend?period=${period}&granularity=${granularity}`,
      ),
    staleTime: 60_000,
    retry: false,
  });
}
