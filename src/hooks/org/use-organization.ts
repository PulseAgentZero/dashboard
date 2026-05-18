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
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Organization updated");
    },
    onError: () => toast.error("Failed to update organization"),
  });
}

export function useUploadOrgLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await orgApi.uploadAsset(file, "logo");
      return orgApi.update({ logo_url: uploaded.url });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Business logo updated");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to upload logo";
      toast.error(msg);
    },
  });
}

export function useRemoveOrgLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => orgApi.update({ logo_url: null }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["organization"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Business logo removed");
    },
    onError: () => toast.error("Failed to remove logo"),
  });
}
