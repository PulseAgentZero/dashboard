import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ssoApi, type SsoConfigBody } from "@/lib/api/sso-api";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useSsoConfig() {
  const enabled = useAuthEnabled() && isSelfHostedDeployment();
  return useQuery({
    queryKey: ["sso", "config"],
    queryFn: () => ssoApi.get(),
    enabled,
    staleTime: 60_000,
  });
}

export function useSaveSsoConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SsoConfigBody) => ssoApi.upsert(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sso", "config"] });
      toast.success("SSO settings saved");
    },
    onError: () => toast.error("Failed to save SSO settings"),
  });
}

export function useDeleteSsoConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ssoApi.remove(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sso", "config"] });
      toast.success("SSO settings removed");
    },
    onError: () => toast.error("Failed to remove SSO settings"),
  });
}
