import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ldapApi, type LdapConfigBody } from "@/lib/api/ldap-api";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useLdapConfig() {
  const enabled = useAuthEnabled() && isSelfHostedDeployment();
  return useQuery({
    queryKey: ["ldap", "config"],
    queryFn: () => ldapApi.get(),
    enabled,
    staleTime: 60_000,
  });
}

export function useSaveLdapConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LdapConfigBody) => ldapApi.upsert(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ldap", "config"] });
      toast.success("LDAP settings saved");
    },
    onError: () => toast.error("Failed to save LDAP settings"),
  });
}

export function useTestLdapConnection() {
  return useMutation({
    mutationFn: () => ldapApi.testConnection(),
    onSuccess: (res) => {
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    },
    onError: () => toast.error("LDAP connection test failed"),
  });
}

export function useSyncLdapNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ldapApi.syncNow(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ldap", "config"] });
      toast.success("LDAP sync completed");
    },
    onError: () => toast.error("LDAP sync failed"),
  });
}
