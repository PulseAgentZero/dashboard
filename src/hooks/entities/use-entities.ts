import { useQuery } from "@tanstack/react-query";
import { entitiesApi } from "@/lib/api/dashboard";

export function useEntities(params?: {
  page?: number;
  limit?: number;
  risk_tier?: string;
  segment?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["entities", params],
    queryFn: () => entitiesApi.list(params),
    staleTime: 30_000,
    retry: 1,
  });
}
