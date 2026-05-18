import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/lib/api/dashboard";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useRecommendations(params?: {
  status?: string;
  urgency?: string;
  limit?: number;
  page?: number;
}) {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => recommendationsApi.list(params),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}
