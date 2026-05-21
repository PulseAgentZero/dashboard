import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { webhooksApi, licenseApi } from "@/lib/api/webhooks-api";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useWebhookDeliveries(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["webhooks", "deliveries", params],
    queryFn: () => webhooksApi.listDeliveries(params),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRetryWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => webhooksApi.retry(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["webhooks", "deliveries"] });
      toast.success("Webhook delivery retried");
    },
    onError: () => toast.error("Failed to retry webhook"),
  });
}

export function useLicense() {
  const enabled = useAuthEnabled() && isSelfHostedDeployment();
  return useQuery({
    queryKey: ["license"],
    queryFn: licenseApi.get,
    enabled,
    staleTime: 300_000,
    retry: false,
  });
}

export function useActivateLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => licenseApi.activate(key),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["license"] });
      toast.success("License activated");
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "message" in err && typeof err.message === "string"
          ? err.message
          : "Invalid or expired license key";
      toast.error(message);
    },
  });
}
