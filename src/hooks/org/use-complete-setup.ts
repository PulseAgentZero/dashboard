import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { orgApi } from "@/lib/api/org-api";

export function useCompleteSetup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => orgApi.completeSetup(),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(data.message);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 409) return;
      toast.error(err instanceof ApiError ? err.message : "Failed to complete setup");
    },
  });
}
