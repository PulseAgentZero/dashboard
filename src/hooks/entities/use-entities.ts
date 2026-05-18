import { useQuery } from "@tanstack/react-query";
import { entitiesApi } from "@/lib/api/dashboard";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useEntities(params?: {
  page?: number;
  limit?: number;
  risk_tier?: string;
  segment?: string;
  search?: string;
}) {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["entities", params],
    queryFn: () => entitiesApi.list(params),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}
