import { useQuery } from "@tanstack/react-query";
import { studioApi } from "@/lib/api/studio-api";

export function useOrgVisualizations(params: { query_id?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ["studio", "visualizations", "org", params.query_id, params.limit],
    queryFn: () =>
      studioApi.listOrgVisualizations({
        query_id: params.query_id,
        limit: params.limit ?? 200,
      }),
    staleTime: 30_000,
  });
}
