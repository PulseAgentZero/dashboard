import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orgApi } from "@/lib/api/org-api";
import type { UpdateOrgRequest } from "@/types/org";

export function useOrganization() {
  return useQuery({
    queryKey: ["organization"],
    queryFn: orgApi.get,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateOrgRequest) => orgApi.update(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Organization updated");
    },
    onError: () => toast.error("Failed to update organization"),
  });
}
