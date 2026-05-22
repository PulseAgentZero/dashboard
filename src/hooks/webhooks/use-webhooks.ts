import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
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
      let message = "Invalid or expired license key";
      if (err instanceof ApiError) {
        if (err.code === "LICENSE_ALREADY_ACTIVATED") {
          message =
            "This license is already bound to another organization. Each key can only be activated once. Use a different key or contact support.";
        } else if (err.code === "LICENSE_EXPIRED") {
          message = "This license has expired. Renew it from the customer portal.";
        } else if (err.code === "LICENSE_REVOKED") {
          message = "This license has been revoked. Please contact support.";
        } else if (err.code === "INVALID_LICENSE_SIGNATURE") {
          message = "License signature is invalid. Make sure you pasted the full plc_… key.";
        } else if (err.code === "LICENSE_SERVER_UNREACHABLE") {
          message =
            "Could not reach the Entivia license server. Check your internet connection and try again.";
        } else if (err.message) {
          message = err.message;
        }
      }
      toast.error(message);
    },
  });
}
