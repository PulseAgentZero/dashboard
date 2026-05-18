import { useQuery } from "@tanstack/react-query";
import { studioApi } from "@/lib/api/studio-api";
import type { StudioVisualization } from "@/types/studio";

export function useVizCatalog(vizIds: string[]) {
  return useQuery({
    queryKey: ["studio", "viz-catalog", vizIds.sort().join(",")],
    queryFn: async () => {
      const map: Record<string, StudioVisualization> = {};
      if (vizIds.length === 0) return map;
      const { queries } = await studioApi.listQueries({ limit: 200 });
      await Promise.all(
        queries.map(async (q) => {
          const { visualizations } = await studioApi.listVisualizations(q.id);
          for (const v of visualizations) {
            if (vizIds.includes(v.id)) map[v.id] = v;
          }
        }),
      );
      return map;
    },
    enabled: vizIds.length > 0,
    staleTime: 60_000,
  });
}
