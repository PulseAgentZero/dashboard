import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/lib/api/dashboard";

export function useRecommendations(params?: {
  status?: string;
  urgency?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => recommendationsApi.list(params),
    staleTime: 30_000,
    retry: 1,
  });
}
