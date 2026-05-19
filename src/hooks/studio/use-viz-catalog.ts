import { useQuery } from "@tanstack/react-query";
import { studioApi } from "@/lib/api/studio-api";
import type { StudioVisualization } from "@/types/studio";

export function useVisualizationsByIds(vizIds: string[]) {
  return useQuery({
    queryKey: ["studio", "visualizations", "by-ids", vizIds.sort().join(",")],
    queryFn: async () => {
      const map: Record<string, StudioVisualization> = {};
      if (vizIds.length === 0) return map;
      const { visualizations } = await studioApi.listOrgVisualizations({ ids: vizIds });
      for (const v of visualizations) {
        map[v.id] = v;
      }
      return map;
    },
    enabled: vizIds.length > 0,
    staleTime: 60_000,
  });
}

/** @deprecated Use useVisualizationsByIds */
export const useVizCatalog = useVisualizationsByIds;
