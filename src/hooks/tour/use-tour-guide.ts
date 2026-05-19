import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orgApi } from "@/lib/api/org-api";
import type { TourGuideState } from "@/types/org";
import { useOrganization } from "@/hooks/org/use-organization";

export function useTourGuideState() {
  const { data: org, isLoading } = useOrganization();
  const completed = org?.tour_guide?.completed === true;
  return { org, isLoading, completed, tourGuide: org?.tour_guide };
}

export function useCompleteTourGuide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: TourGuideState) =>
      orgApi.patchMemberSettings({
        tour_guide: {
          ...patch,
          completed: true,
          version: 1,
          completed_at: new Date().toISOString(),
        },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
