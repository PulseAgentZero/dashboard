import { useQuery } from "@tanstack/react-query";
import { studioApi } from "@/lib/api/studio-api";

const TAG_FETCH_LIMIT = 100;

function collectTagsFromLists(
  queries: { tags?: string[] }[],
  dashboards: { tags?: string[] }[],
): string[] {
  const tags = new Set<string>();
  for (const item of [...queries, ...dashboards]) {
    item.tags?.forEach((t) => tags.add(t));
  }
  return [...tags].sort();
}

/** Tags for filter pills — uses GET /studio/tags when available, else aggregates from lists. */
export function useStudioTags() {
  return useQuery({
    queryKey: ["studio", "tags"],
    queryFn: async (): Promise<string[]> => {
      try {
        const res = await studioApi.listTags();
        return res.tags;
      } catch {
        const [queriesRes, dashboardsRes] = await Promise.all([
          studioApi.listQueries({ limit: TAG_FETCH_LIMIT }),
          studioApi.listDashboards({ limit: TAG_FETCH_LIMIT }),
        ]);
        return collectTagsFromLists(queriesRes.queries, dashboardsRes.dashboards);
      }
    },
    staleTime: 60_000,
  });
}
