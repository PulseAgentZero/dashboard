"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { billingApi } from "@/lib/api/billing-api";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";
import { isCloudDeployment } from "@/lib/deployment";
import { ApiError } from "@/lib/api/client";

export function useSubscription() {
  const enabled = useAuthEnabled() && isCloudDeployment();

  return useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: billingApi.getSubscription,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useInitializeCloudCheckout() {
  return useMutation({
    mutationFn: (callbackUrl: string) => billingApi.initializeCloud(callbackUrl),
    onSuccess: (data) => {
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not start checkout";
      toast.error(msg);
    },
  });
}

export function useVerifyCloudPayment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => billingApi.verifyCloud(reference),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["usage"] });
      void qc.invalidateQueries({ queryKey: ["billing", "subscription"] });
      void qc.invalidateQueries({ queryKey: ["organization"] });
      toast.success(
        data.plan === "pro"
          ? "Pro plan activated. Thank you!"
          : "Payment verified.",
      );
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Payment verification failed";
      toast.error(msg);
    },
  });
}

export function useInitializeSelfHostedCheckout() {
  return useMutation({
    mutationFn: (body: { email: string; callback_url: string }) =>
      billingApi.initializeSelfHosted(body),
    onSuccess: (data) => {
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not start license checkout";
      toast.error(msg);
    },
  });
}

export function useVerifySelfHostedPayment() {
  return useMutation({
    mutationFn: (reference: string) => billingApi.verifySelfHosted(reference),
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "License verification failed";
      toast.error(msg);
    },
  });
}
