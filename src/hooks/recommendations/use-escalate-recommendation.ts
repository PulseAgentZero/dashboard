import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recommendationsApi } from "@/lib/api/dashboard";

export function useEscalateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recommendationsApi.escalate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recommendations"] });
      void qc.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      toast.success("Recommendation escalated");
    },
    onError: () => toast.error("Failed to escalate"),
  });
}
