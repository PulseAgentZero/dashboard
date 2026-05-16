import { useQuery } from "@tanstack/react-query";
import { entitiesFullApi } from "@/lib/api/connections-api";

export function useEntity(entityId: string) {
  return useQuery({
    queryKey: ["entities", entityId],
    queryFn: () => entitiesFullApi.get(entityId),
    staleTime: 30_000,
    enabled: !!entityId,
    retry: 1,
  });
}

export function useEntityRiskHistory(entityId: string, period = "30d") {
  return useQuery({
    queryKey: ["entities", entityId, "risk-history", period],
    queryFn: () => entitiesFullApi.riskHistory(entityId, period),
    staleTime: 60_000,
    enabled: !!entityId,
    retry: 1,
  });
}
