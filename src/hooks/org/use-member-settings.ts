import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orgApi } from "@/lib/api/org-api";
import type { MemberSettingsRequest } from "@/types/org";

export function usePatchMemberSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MemberSettingsRequest) => orgApi.patchMemberSettings(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });
}
